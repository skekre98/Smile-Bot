#!/bin/bash 

echo Git commit message:


# Get user input
read msg

git add .

git commit -m "$msg"

git push