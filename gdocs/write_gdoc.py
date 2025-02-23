from gdocs.gdoc_api import get_credentials, create_document, write_doc_heading, write_topic, write_subtopic_title, write_subtopic_body
from oai.oai_model import DocumentText, Subtopic, Topic, query_text_model, query_whisper

creds = get_credentials()


def write_notes():
    doc_id = create_document(creds, "Neel Test")
    write_doc_heading(creds, "Show Neel my flow (pause)", doc_id)
    lecture_transcript = query_whisper('bla')
    formatted_notes = query_text_model(lecture_transcript)
    print(type(formatted_notes), len(formatted_notes.topics))
    for topic in formatted_notes.topics:
        write_topic(creds, topic.title, doc_id)
        for subtopic in topic.subtopics:
            write_subtopic_title(creds, subtopic.subtopic_title, doc_id)
            write_subtopic_body(creds, subtopic.subtopic_body, doc_id)
        print(f'topic {topic.title}, written')
    print('DONE!!!! ')
write_notes()
