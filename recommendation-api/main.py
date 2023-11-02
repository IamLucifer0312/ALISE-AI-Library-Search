# pip intall flask
# pip install scikit-learn

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
import json
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/recommend', methods=['POST'])
def recommend():
    # Parse the JSON data
    data = request.get_json()

    repos = []
    readmes = []
    user_prompt = data['userPrompt']

    for result in data['results']:
        repos.append(result)
        readmes.append(result['readme'])

    repos_recommendations = sort_by_relevance(repos, readmes, user_prompt)
    data['results'] = repos_recommendations

    return jsonify(data)


def sort_by_relevance(repos, readmes, user_prompt):
    # TF-IDF vectorization
    tfidf_vectorizer = TfidfVectorizer()
    tfidf_matrix = tfidf_vectorizer.fit_transform(readmes)
    user_vector = tfidf_vectorizer.transform([user_prompt])

    # Calculate cosine similarity
    cosine_similarities = linear_kernel(user_vector, tfidf_matrix)

    # Get library recommendations
    repos_recommendations = [repos[i] for i in cosine_similarities.argsort()[0][::-1]]
    return repos_recommendations

if __name__ == '__main__':
    app.run(port = 8000)
