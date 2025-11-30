#!/bin/bash

API_URL="https://fe-hiring-rest-api.vercel.app"

echo "Checking API Health..."
HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/health")

if [ "$HEALTH_STATUS" -eq 200 ]; then
    echo "API is healthy."
else
    echo "API health check failed with status $HEALTH_STATUS"
    exit 1
fi

# Prompt for credentials
echo "Please enter your login credentials."
read -p "Email: " EMAIL
read -s -p "Password: " PASSWORD
echo ""

echo "Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

# Extract token using grep/sed (fallback if jq is not installed)
if command -v jq &> /dev/null; then
    TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r .token)
else
    TOKEN=$(echo "$LOGIN_RESPONSE" | sed -n 's/.*"token":"\([^"]*\)".*/\1/p')
fi

if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ]; then
    echo "Login failed. Response: $LOGIN_RESPONSE"
    exit 1
fi

echo "Login successful!"

CATEGORIES=("NOTICE" "QNA" "FREE")

echo "Starting to create 100 posts..."

for i in {1..100}
do
    # Random category
    RAND_CAT=${CATEGORIES[$((RANDOM % ${#CATEGORIES[@]}))]}
    
    # Create post
    curl -s -X POST "$API_URL/posts" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "{
        \"title\": \"Sample Post #$i ($RAND_CAT)\",
        \"body\": \"This is a sample post generated via curl script. Index: $i\",
        \"category\": \"$RAND_CAT\",
        \"tags\": [\"sample\", \"curl\", \"test\"]
      }" > /dev/null
      
    echo -ne "Created post $i/100\r"
done

echo ""
echo "Done! Created 100 sample posts."
