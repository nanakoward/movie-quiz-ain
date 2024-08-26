import json

def clean_json_file(input_file, output_file):
    # JSON 파일 읽기
    with open(input_file, 'r', encoding='utf-8') as file:
        content = file.read()

    # 줄 바꿈을 \n으로 변환
    content = content.replace('\n', '\\n')

    # 수정된 내용을 새로운 JSON 파일에 저장
    with open(output_file, 'w', encoding='utf-8') as file:
        file.write(content)

# 파일 경로
input_file = '/Users/ain/Documents/GitHub/movie-quiz-ain/questions.json'
output_file = '/Users/ain/Documents/GitHub/movie-quiz-ain/questions copy.json'
clean_json_file(input_file, output_file)
