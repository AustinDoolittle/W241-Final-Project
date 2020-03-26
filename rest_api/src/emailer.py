import smtplib
import ssl

INITIAL_SCRIPT_TEMPLATE = """
Hello, and thank you again for agreeing to take part in our study. 

Below is a link to the web application where you will play a series of games, which should take no longer than 10 minutes. Please click the link when you are able to complete the game on a computer using Chrome or Firefox in a single session, as you will not be given another attempt to participate if you leave the webpage early. You will also not be allowed to proceed if you attempt to access the page on a mobile device. You must complete this task by {due_date}.

{external_link}

Thank you,

UC Berkeley students
School of Information
"""

REMINDER_SCRIPT_TEMPLATE = """\
Hello,

Our records indicate that you have not yet completed the tasks that have been sent to you. Please navigate to the link below and complete the assigned game by {due_date}.

{external_link}

Thank you,

UC Berkeley students
School of Information
"""

class Emailer:
    _SMTP_SERVER = "smtp.gmail.com"
    _SMTP_PORT = 587
    _MESSAGE_SUBJECT = "UC Berkeley Experiment Participation"

    _MESSAGE_CONTENT_TEMPLATE = "Subject: {subject}\n\n{body}"

    def __init__(self, sender_email_address, sender_password):
        self._sender_email_address = sender_email_address
        self._sender_password = sender_password
        self._ssl_context = ssl.create_default_context()
        self._server = smtplib.SMTP(self._SMTP_SERVER, self._SMTP_PORT)
        self._server.starttls(context=self._ssl_context)
        self._server.login(self._sender_email_address, self._sender_password)

    def _construct_message(self, external_link, due_date, send_reminder=False):
        due_date_string = due_date.strftime('%B %d')
        if send_reminder:
            body_template = REMINDER_SCRIPT_TEMPLATE
        else:
            body_template = INITIAL_SCRIPT_TEMPLATE
        
        body_text = body_template.format(external_link=external_link, due_date=due_date_string)
        return self._MESSAGE_CONTENT_TEMPLATE.format(subject=self._MESSAGE_SUBJECT, body=body_text)

    def send_email(self, recipient_email_address, external_link, due_date, send_reminder=False):
        mail_text = self._construct_message(external_link, due_date, send_reminder=send_reminder)
        self._server.sendmail(self._sender_email_address, recipient_email_address, mail_text)
