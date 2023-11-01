# pip intall flask
# pip install scikit-learn

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
import json
from flask import Flask, request, jsonify

app = Flask(__name__)

sample_data = """
{
    "userPrompt": "Find Python library for face detection",
    "count": 10,
    "results": [
        {
            "owner": "ddesmond",
            "repo": "face_cog",
            "url": "www.facecog.com",
            "readme": "This library is for real time facial recognition using Python."
        },

        {
            "owner": "BuiKho",
            "repo": "app_Grindr",
            "url": "www.grindr.com",
            "readme": "This library is for the website Grindr."
        },

        {
            "owner": "TeTe",
            "repo": "object_detection",
            "url": "www.objdet.com",
            "readme": "This library is objection detection using tensorflow"
        }
    ]
}
"""

@app.route('/recommend', methods=['POST'])
def recommend():
# JSON data as a string


    # Parse the JSON data
    data = request.get_json()

    repos = []
    readmes = []
    user_prompt = data['userPrompt']

    # Extract the 'repo', 'url', and 'readme' fields
    for result in data['results']:
        repos.append(result)
        readmes.append(result['readme'])

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

    repos_recommendations = sort_by_relevance(repos, readmes, user_prompt)
    print("Recommended Libraries:", repos_recommendations)
    data['results'] = repos_recommendations

    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True, port = 8000)
