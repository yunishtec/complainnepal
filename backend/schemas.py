from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional, List

class CommentBase(BaseModel):
    text: str

class CommentCreate(CommentBase):
    pass

class Comment(CommentBase):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: int
    complaint_id: int = Field(alias="complaintId")
    created_at: datetime = Field(alias="createdAt")

class ComplaintBase(BaseModel):
    title: str
    description: str
    category: str
    location: str

class ComplaintCreate(ComplaintBase):
    pass

class Complaint(ComplaintBase):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: int
    media_url: str = Field(alias="mediaUrl")
    status: str
    upvotes: int
    created_at: datetime = Field(alias="createdAt")
    comment_count: Optional[int] = Field(0, alias="commentCount")
