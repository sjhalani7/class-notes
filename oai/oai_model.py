from typing import List
from openai import OpenAI
import configs.api_keys as config
from pydantic import BaseModel


client = OpenAI(api_key=config.open_ai_api_key)
PROMPT_FILE = "oai/developer_prompt.txt"

class Subtopic(BaseModel):
    subtopic_title:str
    subtopic_body: List[str]


class Topic(BaseModel):
    title:str
    subtopics:List[Subtopic]


class DocumentText(BaseModel):
    topics:List[Topic]


def query_text_model(question_query:str) -> DocumentText:
    with open(PROMPT_FILE, 'r') as file:  
        developer_query = file.read()
    
    completion = client.beta.chat.completions.parse(
    model="gpt-4o-2024-08-06",
    messages = [
        {"role": "developer", "content": f"{developer_query}"},
        {
            "role": "user",
            "content": f"{question_query}"
        }
    ],
    response_format=DocumentText,
    )
    return completion.choices[0].message.parsed

def query_whisper(audio_file_path:str) -> str:
   audio_file = open(audio_file_path, "rb")
   transcription = client.audio.transcriptions.create(
    model="whisper-1", 
    file=audio_file
   )
   return transcription.text   




# print(query_text_model(sample))