from gdocs.gdoc_api import (
    get_credentials,
    create_document,
    write_doc_heading,
    write_topic,
    write_subtopic_title,
    write_subtopic_body,
)
from oai.oai_model import query_text_model, query_whisper
from oai.record_audio import record_audio
import os
import time
import shutil
from pydub import AudioSegment

creds = get_credentials()


def split_audio_file(file_path: str) -> str:
    audio = AudioSegment.from_file(file_path)
    half_duration = len(audio) // 2
    first_half = audio[:half_duration]
    second_half = audio[half_duration:]

    root, ext = os.path.splitext(file_path)
    part1_path = root + "_part1" + ext
    part2_path = root + "_part2" + ext

    # Export first half
    first_half.export(part1_path, format=ext[1:])
    # Export second half
    second_half.export(part2_path, format=ext[1:])

    return f"Audio split into two files: {part1_path} and {part2_path}"


def valid_audio_file_size(file_path: str, max_size_mb: int = 25) -> bool:
    file_size_mb = os.path.getsize(file_path) / (1024 * 1024)
    return file_size_mb <= max_size_mb


def write_notes_for_file(doc_id: str, lecture_transcript: str):
    formatted_notes = query_text_model(lecture_transcript)
    print(type(formatted_notes), len(formatted_notes.topics))
    for topic in formatted_notes.topics:
        write_topic(creds, topic.title, doc_id)
        for subtopic in topic.subtopics:
            write_subtopic_title(creds, subtopic.subtopic_title, doc_id)
            write_subtopic_body(creds, subtopic.subtopic_body, doc_id)
        print(f"topic {topic.title}, written")
    print("DONE!!!! ")


def process_audio_files():
    files = sorted(
        [
            f
            for f in os.listdir("audio_files")
            if os.path.isfile(os.path.join("audio_files", f))
        ]
    )
    for file in files:
        audio_path = f"audio_files/{file}"
        if not valid_audio_file_size(audio_path):
            split_audio_file(audio_path)
            os.remove(audio_path)


def write_all_notes(doc_title: str = "CSEN 163: 04/24/2025"):
    print("Processing Files")
    process_audio_files()
    files = sorted(
        [
            f
            for f in os.listdir("audio_files")
            if os.path.isfile(os.path.join("audio_files", f))
        ]
    )
    doc_id = create_document(creds, doc_title)
    write_doc_heading(creds, doc_title, doc_id)
    lecture_transcript = ""
    print("Transcribing Lecture")
    for file in files:
        audio_path = f"audio_files/{file}"
        lecture_transcript += query_whisper(audio_path)
        os.remove(audio_path)
        backup_transcript(lecture_transcript)
    print("Writing Files")
    write_notes_for_file(doc_id, lecture_transcript)
    shutil.rmtree("transcripts")


def backup_transcript(lecture_transcript: str):
    timestamp = time.strftime("%Y%m%d-%H%M%S")
    backup_file = f"transcripts/transcript_{timestamp}.txt"
    os.makedirs("transcripts", exist_ok=True)
    with open(backup_file, "w") as f:
        f.write(lecture_transcript)
    print(f"Transcript backed up to {backup_file}")


def record_class_lecture():
    class_duration = int(
        input("How long is class (in min): ")
    )  # [TODO] - Input error handling
    num_recordings = (
        class_duration // 10
    )  # [TODO] - different way to grab num recordings
    for i in range(num_recordings):
        if not record_audio():
            print("Stopping further recordings.")
            break


def main():
    record_class_lecture()
    write_all_notes()


main()
