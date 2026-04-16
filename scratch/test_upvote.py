import requests

def test_upvote():
    # Attempting to upvote complaint with ID 1
    url = "http://127.0.0.1:8000/api/complaints/1/upvote"
    try:
        response = requests.post(url)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_upvote()
