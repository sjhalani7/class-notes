import os.path

import google
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# If modifying these scopes, delete the file token.json.
SCOPES = ["https://www.googleapis.com/auth/documents"]

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

def get_doc_length(creds: google.oauth2.credentials.Credentials, doc_id: str) -> str: 
    try:
        service = build("docs", "v1", credentials=creds)
        document = service.documents().get(documentId=doc_id).execute()
        content = document.get('body', None).get('content', None)
        if content:
            return content[-1].get('endIndex', 1)
        return 1 
    except HttpError as err:
        print("Error in getting doc length ", err)
        raise

def batch_update_document(creds: google.oauth2.credentials.Credentials, request_body: str, document_id: str) -> dict:
    try:
        service = build("docs", "v1", credentials=creds)
        document = service.documents().batchUpdate(documentId=document_id, body=request_body).execute()
        return document
    except HttpError as err:
        print(f"Error in writing to gdoc: {err}")
        raise
        


def create_document(creds: google.oauth2.credentials.Credentials, title: str) -> str:
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
        raise


def write_doc_heading(creds:google.oauth2.credentials.Credentials, heading:str, doc_id:str) -> None:
    doc_length = get_doc_length(creds, doc_id)
    text_to_insert = "\n" + heading + "\n"
    insertion_index = max(doc_length - 1, 0)

    insert_request = {
        'insertText': {
            'text': text_to_insert,
            'location': {'index': insertion_index}
        }
    }

    formatting_start = insertion_index + 1
    formatting_end  = formatting_start + len(heading)

    text_style_format_request = {
        "updateTextStyle": {
            'textStyle': {
                'bold': True,
            },
            'fields':'bold',
            'range':{
                'startIndex': formatting_start,
                'endIndex': formatting_end 
            }
        }
    }

    paragraph_style_format_request = {
        'updateParagraphStyle': {
            'paragraphStyle': {
                'alignment': 'CENTER'
            },
            'range': {
                'startIndex': formatting_start,
                'endIndex': formatting_end 
            },
            'fields': 'alignment'
        }
    }

    request_body = {
        "requests": [
            insert_request,
            text_style_format_request,
            paragraph_style_format_request
        ]
    }
    batch_update_document(creds, request_body, document_id=doc_id)

def write_topic(creds:google.oauth2.credentials.Credentials, topic:str, doc_id:str) -> None:
    doc_length = get_doc_length(creds, doc_id)
    if doc_length > 1:
        text_to_insert = "\n" + topic + '\n'
        insertion_index = doc_length - 1  
        formatting_start = insertion_index + 1  
    else:
        text_to_insert = topic
        insertion_index = doc_length
        formatting_start = insertion_index
    formatting_end = formatting_start + len(topic)

    insert_request = {
        'insertText': {
        'text': text_to_insert,
        "location": {'index': insertion_index}
        }
    }
    
    text_style_format_request = {
        "updateTextStyle": {
            'textStyle': {
                'bold': True,
            },
            'fields':'bold',
            'range':{
                'startIndex': formatting_start,
                'endIndex': formatting_end 
            }
        }
    }

    paragraph_style_format_request = {
        'updateParagraphStyle':{
            'paragraphStyle':{
                'alignment': 'START',
                'namedStyleType': 'HEADING_1'
            },
            'range':{
                'startIndex': formatting_start,
                'endIndex': formatting_end 
            },
            'fields':'namedStyleType,alignment'
        }
    }

    request_body = {
        "requests": [
            insert_request,
            text_style_format_request,
            paragraph_style_format_request
        ]
    }
    batch_update_document(creds, request_body, document_id=doc_id)

def write_subtopic_title(creds:google.oauth2.credentials.Credentials, subtopic:str, doc_id:str) -> None:
    doc_length = get_doc_length(creds, doc_id)
    if doc_length > 1:
        text_to_insert = "\n" + subtopic + "\n"
        insertion_index = doc_length - 1  
        formatting_start = insertion_index + 1  
    else:
        text_to_insert = subtopic
        insertion_index = doc_length
        formatting_start = insertion_index
    formatting_end = formatting_start + len(subtopic)

    insert_request = {
        'insertText': {
        'text': text_to_insert,
        "location": {'index': insertion_index}
        }
    }
    
    text_style_format_request = {
        "updateTextStyle": {
            'textStyle': {
                'bold': True,
            },
            'fields':'bold',
            'range':{
                'startIndex': formatting_start,
                'endIndex': formatting_end 
            }
        }
    }

    paragraph_style_format_request = {
        'updateParagraphStyle':{
            'paragraphStyle':{
                'namedStyleType': 'HEADING_2'
            },
            'range':{
                'startIndex': formatting_start,
                'endIndex': formatting_end 
            },
            'fields':'namedStyleType'
        }
    }

    request_body = {
        "requests": [
            insert_request,
            text_style_format_request,
            paragraph_style_format_request
        ]
    }
    batch_update_document(creds, request_body, document_id=doc_id)

def write_subtopic_body(creds:google.oauth2.credentials.Credentials, body:str, doc_id:str) -> None:
    for line in body:
        doc_length = get_doc_length(creds, doc_id)
        insertion_index = doc_length - 1 if doc_length > 1 else doc_length
        insert_request = {
            'insertText': {
                'text': line + "\n",
                'location': {'index': insertion_index}
            }
        }

        formatting_start = insertion_index
        formatting_end = insertion_index + len(line) + 1

        create_bullets_request = {
            "createParagraphBullets": {
                'range': {
                    'startIndex': formatting_start,
                    'endIndex': formatting_end
                },
                'bulletPreset': 'BULLET_DISC_CIRCLE_SQUARE'
            }
        }

        request_body = {
            "requests": [
                insert_request,
                create_bullets_request
            ]
        }
        batch_update_document(creds, request_body, document_id=doc_id)


def main():
    creds = get_credentials()
    doc_id = create_document(creds, 'test2- post refactor')

    
