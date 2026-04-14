import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from ..config import settings
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

def send_complaint_email(to_email, complaint_data):
    subject = f"Public Complaint: {complaint_data['title']}"
    body = f"""
New issue reported via ComplaineNepal:

Title: {complaint_data['title']}
Category: {complaint_data['category']}
Location: {complaint_data['location']}
Description: {complaint_data['description']}
Media URL: {complaint_data['media_url']}

Please take necessary action.
    """

    # Try SendGrid first
    if settings.SENDGRID_API_KEY:
        message = Mail(
            from_email=settings.SMTP_FROM_EMAIL or "noreply@complainenepal.com",
            to_emails=to_email,
            subject=subject,
            plain_text_content=body
        )
        try:
            sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
            response = sg.send(message)
            return True
        except Exception as e:
            print(f"SendGrid failed: {e}")

    # Fallback to SMTP
    if settings.SMTP_USER and settings.SMTP_PASS:
        try:
            msg = MIMEMultipart()
            msg['From'] = settings.SMTP_FROM_EMAIL or settings.SMTP_USER
            msg['To'] = to_email
            msg['Subject'] = subject
            msg.attach(MIMEText(body, 'plain'))

            server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASS)
            server.send_message(msg)
            server.quit()
            return True
        except Exception as e:
            print(f"SMTP failed: {e}")
    
    return False
