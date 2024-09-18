import sys
from metaphone import doublemetaphone

def process_data(data):
    primary, secondary = doublemetaphone(data)
    return primary

if __name__ == "__main__":
    # Read input data passed from Node.js
    input_data = sys.stdin.read().strip()  # Read raw input string
    
    # Process the data
    result = process_data(input_data)

    # Return the result to Node.js
    print(result) 
