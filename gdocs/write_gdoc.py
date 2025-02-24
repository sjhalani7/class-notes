from gdocs.gdoc_api import get_credentials, create_document, write_doc_heading, write_topic, write_subtopic_title, write_subtopic_body
from oai.oai_model import DocumentText, Subtopic, Topic, query_text_model, query_whisper
from oai.record_audio import record_audio
import os

creds = get_credentials()



def write_notes_for_file(lecture_transcript: str, doc_title: str, doc_heading: str=None):
    doc_id = create_document(creds, doc_title)
    write_doc_heading(creds, doc_heading if doc_heading else doc_title, doc_id)
    formatted_notes = query_text_model(lecture_transcript)
    print(type(formatted_notes), len(formatted_notes.topics))
    for topic in formatted_notes.topics:
        write_topic(creds, topic.title, doc_id)
        for subtopic in topic.subtopics:
            write_subtopic_title(creds, subtopic.subtopic_title, doc_id)
            write_subtopic_body(creds, subtopic.subtopic_body, doc_id)
        print(f'topic {topic.title}, written')
    print('DONE!!!! ')


def write_all_notes():
    files = [f for f in os.listdir('audio_files') if os.path.isfile(os.path.join('audio_files', f))]
    for file in files:
        audio_path = f'audio_files/{file}'
        lecture_transcript = query_whisper(audio_path)
        write_notes_for_file(lecture_transcript, f'Class Notes - {file}')
        os.remove(audio_path)

def record_class_lecture():
    class_duration = int(input('How long is class (in min): ')) #[TODO] - Input error handling
    num_recordings = class_duration//10 #[TODO] - different way to grab num recordings
    for i in range(num_recordings):
       record_audio()
    

