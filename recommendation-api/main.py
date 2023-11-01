# pip intall flask
# pip install sklearn

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
import json
from flask import Flask, request, jsonify

# JSON data as a string
json_data = """
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
            "owner": "BuiTo",
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

# Parse the JSON data
data = json.loads(json_data)

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