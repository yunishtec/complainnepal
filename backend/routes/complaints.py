from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from ..database import get_db
from .. import models, schemas
from ..services import cloudinary_service, email_service, category_mapper

router = APIRouter(prefix="/api/complaints", tags=["complaints"])

@router.post("")
async def create_complaint(
    title: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    location: str = Form(...),
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    try:
        # 1. Validation & Multi-file Upload
        if len(files) > 5:
            raise HTTPException(status_code=400, detail="Maximum 5 files allowed.")

        uploaded_urls = []
        for file in files:
            # Basic size validation (Photo < 5MB, Video < 50MB)
            content = await file.read()
            size_mb = len(content) / (1024 * 1024)
            is_video = file.content_type.startswith("video/")
            
            if is_video and size_mb > 300:
                raise HTTPException(status_code=400, detail=f"Video {file.filename} exceeds the 300MB maximum limit.")
            if not is_video and size_mb > 5:
                raise HTTPException(status_code=400, detail=f"Photo {file.filename} exceeds 5MB limit.")

            # Upload with background compression (handled by service)
            result = cloudinary_service.upload_media(content)
            if result["url"]:
                uploaded_urls.append(result["url"])
            else:
                raise HTTPException(status_code=500, detail=f"Cloudinary Error: {result['error']}")

        # Combined strings for DB
        media_urls_str = ",".join(uploaded_urls)
        print(f"DEBUG: Saving complaint with URLs: {media_urls_str}")

        # 2. Store in DB
        db_complaint = models.Complaint(
            title=title,
            description=description,
            category=category,
            location=location,
            media_url=media_urls_str
        )
        db.add(db_complaint)
        db.commit()
        db.refresh(db_complaint)

        # 3. Trigger email service
        try:
            authority_email = category_mapper.get_authority_email(category)
            email_service.send_complaint_email(authority_email, {
                "title": title,
                "category": category,
                "location": location,
                "description": description,
                "media_url": uploaded_urls[0] # Send first image in email
            })
        except Exception as e:
            print(f"Email failed: {e}")

        return {"message": "Complaint submitted", "id": db_complaint.id, "mediaUrl": media_urls_str}
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Backend Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("", response_model=List[schemas.Complaint])
def get_complaints(skip: int = 0, limit: int = 100, category: str = None, db: Session = Depends(get_db)):
    query = db.query(
        models.Complaint,
        func.count(models.Comment.id).label("comment_count")
    ).outerjoin(models.Comment)

    if category and category != 'All' and category != 'सबै':
        query = query.filter(models.Complaint.category == category)

    results = query.group_by(models.Complaint.id).order_by(models.Complaint.created_at.desc()).offset(skip).limit(limit).all()
    
    complaints = []
    for complaint, comment_count in results:
        comp = schemas.Complaint.model_validate(complaint)
        comp.comment_count = comment_count
        complaints.append(comp)
        
    return complaints

@router.get("/{id}", response_model=schemas.Complaint)
def get_complaint(id: int, db: Session = Depends(get_db)):
    # Fetch complaint and count its comments
    result = db.query(
        models.Complaint,
        func.count(models.Comment.id).label("comment_count")
    ).outerjoin(models.Comment).filter(models.Complaint.id == id).group_by(models.Complaint.id).first()
    
    if not result:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    complaint, comment_count = result
    comp = schemas.Complaint.model_validate(complaint)
    comp.comment_count = comment_count
    return comp

@router.post("/{id}/upvote")
def upvote_complaint(id: int, db: Session = Depends(get_db)):
    db_complaint = db.query(models.Complaint).filter(models.Complaint.id == id).first()
    if not db_complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    # Handle potential NULL values in the database
    if db_complaint.upvotes is None:
        db_complaint.upvotes = 0
        
    db_complaint.upvotes += 1
    db.commit()
    db.refresh(db_complaint)
    return {"upvotes": db_complaint.upvotes}

@router.post("/{id}/unvote")
def unvote_complaint(id: int, db: Session = Depends(get_db)):
    db_complaint = db.query(models.Complaint).filter(models.Complaint.id == id).first()
    if not db_complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    if db_complaint.upvotes is not None and db_complaint.upvotes > 0:
        db_complaint.upvotes -= 1
        
    db.commit()
    db.refresh(db_complaint)
    return {"upvotes": db_complaint.upvotes}

@router.get("/{id}/comments", response_model=List[schemas.Comment])
def get_comments(id: int, db: Session = Depends(get_db)):
    return db.query(models.Comment).filter(models.Comment.complaint_id == id).all()

@router.post("/{id}/comments", response_model=schemas.Comment)
def add_comment(id: int, comment: schemas.CommentCreate, db: Session = Depends(get_db)):
    # Limit to prevent abuse, but allow a healthy conversation
    current_count = db.query(models.Comment).filter(models.Comment.complaint_id == id).count()
    if current_count >= 100:
        raise HTTPException(status_code=400, detail="Maximum discussion limit reached for this report.")

    db_comment = models.Comment(complaint_id=id, text=comment.text)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment
