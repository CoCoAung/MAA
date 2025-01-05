import requests

# Constants for API URLs
SOLAR_SYSTEM_API_URL = 'https://api.le-systeme-solaire.net/rest.php'

def list_bodies(data=None, exclude=None, order=None, page=None):
    params = {}
    if data:
        params['data'] = data
    if exclude:
        params['exclude'] = exclude
    if order:
        params['order'] = order
    if page:
        params['page'] = page

    response = requests.get(f'{SOLAR_SYSTEM_API_URL}/bodies', params=params)
    
    if response.status_code == 200:
        return response.json().get('bodies', [])
    else:
        print(f"Error fetching bodies: {response.status_code}")
        return None

def find_body_by_name(bodies, name):
    for body in bodies:
        if body['name'].lower() == name.lower() or body['englishName'].lower() == name.lower():
            return body
    return None

def get_body_details(body_id):
    response = requests.get(f'{SOLAR_SYSTEM_API_URL}/bodies/{body_id}')
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error fetching body details: {response.status_code}")
        return None

if __name__ == "__main__":
    print("Fetching all solar system bodies...")
    bodies = list_bodies(data='id,name,englishName,isPlanet,semimajorAxis')

    if bodies:
        print("Available bodies:")
        for body in bodies:
            print(f"ID: {body['id']}, Name: {body['name']}, English Name: {body['englishName']}, Is Planet: {body['isPlanet']}")

    while True:
        body_name = input("\nEnter the name of a body to get more details (or type 'exit' to quit): ")
        
        if body_name.lower() == 'exit':
            print("Exiting the program. Goodbye!")
            break

        matched_body = find_body_by_name(bodies, body_name)

        if matched_body:
            details = get_body_details(matched_body['id'])
            if details:
                print("\nBody Details:")
                print(f"ID: {details['id']}")
                print(f"Name: {details['name']}")
                print(f"English Name: {details['englishName']}")
                print(f"Is Planet: {details['isPlanet']}")
                print(f"Semimajor Axis: {details['semimajorAxis']} km")
            else:
                print("Failed to retrieve body details.")
        else:
            print("No matching body found.")
