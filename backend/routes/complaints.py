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
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # 1. Upload media to Cloudinary
    content = await file.read()
    media_url = cloudinary_service.upload_media(content)
    
    if not media_url:
        raise HTTPException(status_code=500, detail="Failed to upload media")

    # 2. Store in DB
    db_complaint = models.Complaint(
        title=title,
        description=description,
        category=category,
        location=location,
        media_url=media_url
    )
    db.add(db_complaint)
    db.commit()
    db.refresh(db_complaint)

    # 3. Trigger email service
    authority_email = category_mapper.get_authority_email(category)
    email_service.send_complaint_email(authority_email, {
        "title": title,
        "category": category,
        "location": location,
        "description": description,
        "media_url": media_url
    })

    return {"message": "Complaint submitted successfully", "id": db_complaint.id, "media_url": media_url}

@router.get("", response_model=List[schemas.Complaint])
def get_complaints(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Calculate comment count for each complaint
    results = db.query(
        models.Complaint,
        func.count(models.Comment.id).label("comment_count")
    ).outerjoin(models.Comment).group_by(models.Complaint.id).offset(skip).limit(limit).all()
    
    complaints = []
    for complaint, comment_count in results:
        comp = schemas.Complaint.model_validate(complaint)
        comp.comment_count = comment_count
        complaints.append(comp)
        
    return complaints

@router.post("/{id}/upvote")
def upvote_complaint(id: int, db: Session = Depends(get_db)):
    db_complaint = db.query(models.Complaint).filter(models.Complaint.id == id).first()
    if not db_complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    db_complaint.upvotes += 1
    db.commit()
    return {"upvotes": db_complaint.upvotes}

@router.get("/{id}/comments", response_model=List[schemas.Comment])
def get_comments(id: int, db: Session = Depends(get_db)):
    return db.query(models.Comment).filter(models.Comment.complaint_id == id).all()

@router.post("/{id}/comments", response_model=schemas.Comment)
def add_comment(id: int, comment: schemas.CommentCreate, db: Session = Depends(get_db)):
    db_comment = models.Comment(complaint_id=id, text=comment.text)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment
