import os.path

import google
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# If modifying these scopes, delete the file token.json.
SCOPES = ["https://www.googleapis.com/auth/documents"]
DOCUMENT_ID = "1xdfadI1MO71_URrVueOtdsxU527FXW33DDiCHHKZ1dE" 

def get_credentials():
    creds = None
    if os.path.exists("configs/token.json"):
        creds = Credentials.from_authorized_user_file("configs/token.json", SCOPES)
    if not creds or not creds.valid: #login needed
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
            "configs/credentials.json", SCOPES
            )
            creds = flow.run_local_server(port=0)

        with open("configs/token.json", "w") as token:
            token.write(creds.to_json()) #save for next run
    return creds


def create_document(creds:google.oauth2.credentials.Credentials, title:str) -> str:
    try:
        service = build("docs", "v1", credentials=creds)
        request_body = {
            'title': title
        }

        document = service.documents().create(body=request_body).execute()
        doc_id = document.get('documentId')
        return doc_id
    except HttpError as err:
        print(err)

creds = get_credentials()
create_document(creds, 'test2- post refactor')

# def write_to_doc(creds:google.oauth2.credentials.Credentials, title:str, doc_id:str):
    
