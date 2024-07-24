#!/bin/bash

# Check if the correct number of arguments is provided
if [ "$#" -ne 3 ]; then
  echo "Usage: $0 source_file destination_directory number_of_copies"
  exit 1
fi

# Assign arguments to variables
source_file=$1
destination_directory=$2
number_of_copies=$3

# Check if the source file exists
if [ ! -f "$source_file" ]; then
  echo "Source file does not exist."
  exit 1
fi

# Check if the destination directory exists
if [ ! -d "$destination_directory" ]; then
  echo "Destination directory does not exist. Creating it now..."
  mkdir -p "$destination_directory"
fi

# Loop to create copies
for ((i=1; i<=number_of_copies; i++)); do
  cp "$source_file" "$destination_directory/$(basename "$source_file" .${source_file##*.})_copy$i.${source_file##*.}"
done

echo "$number_of_copies copies of $source_file have been created in $destination_directory."
