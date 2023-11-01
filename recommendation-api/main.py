from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

# Sample library data and user problem description
libraries = ["Library A", "Library B", "Library C"]
library_descriptions = ["Library A is a powerful library for data analysis.", "Library B provides efficient algorithms for image processing.", "Library C is a popular web development framework."]
user_problem = "I need to process image data efficiently."

# TF-IDF vectorization
tfidf_vectorizer = TfidfVectorizer()
tfidf_matrix = tfidf_vectorizer.fit_transform(library_descriptions)
user_vector = tfidf_vectorizer.transform([user_problem])

# Calculate cosine similarity
cosine_similarities = linear_kernel(user_vector, tfidf_matrix)

# Get library recommendations
library_recommendations = [libraries[i] for i in cosine_similarities.argsort()[0][::-1]]

print("Recommended Libraries:", library_recommendations)