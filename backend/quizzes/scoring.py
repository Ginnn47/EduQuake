def score_answers(questions, answers):
    if not questions:
        return 0
    correct = sum(1 for question in questions if answers.get(question["id"]) == question["answer"])
    return round((correct / len(questions)) * 100)
