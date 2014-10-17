#!/bin/bash

dbUser="chris"
dbName="chris"
usersDirectory="/home/chris/users"

G_SYNOPSIS="

 NAME

       checkDB.bash

 SYNOPSIS

       checkDB.bash -h <usersDirectory> -n <dbName> -u <dbUser>

 DESCRIPTION

        'checkDB.bash' is a simple script that checks and fixes inconsistencies
	between a user's feed as recorded in the ChRIS database and the feed
	on the filesystem.

	If inconsistencies are found, the script will present the option of 

		[1] - Remove the entry from the DB if there is no corresponding
		      feed on the filesystem.
		[2] - Create a directory again on the filesystem. Note that this
		      feed directory will of course be empty.
		[3] - Ignore.

 ARGS

	-h <usersDirectory> (defaults to: $usersDirectory)
	The 'home' directory within the ChRIS tree. This directory contains the
	feeds of each user, organized by user name.

	-n <dbName> (defaults to $dbName)
	The name of the data base instance running on the system.

	-u <dbUser> (defaults to $dbUser)
	The ChRIS user to check.
  
 PRECONDITIONS

	o The script user must know the database MySQL password.
        o A ChRIS DB that has been instantiated.
	o User's feed directories.

 POSTCONDITIONS

	o DB made consistent to the filesystem.

"


sqlCommand="SELECT user.username,feed.plugin,feed.name,feed.id FROM user JOIN feed ON user.id=feed.user_id;"
sqlDeleteFeedCommand="DELETE FROM feed WHERE feed.id="
sqlDeleteFeedDataCommand="DELETE FROM feed_data WHERE feed_data.feed_id="
sqlDeleteFeedTagCommand="DELETE FROM feed_tag WHERE feed_tag.feed_id="
sqlDeleteFeedMetaCommand="DELETE FROM meta WHERE meta.target_type=\"feed\" AND meta.target_id="

while getopts u:h:n: option ; do
        case "$option"
        in
                u)      dbUser=$OPTARG			;;
                n)      dbName=$OPTARG			;;
                h)      usersDirectory="$OPTARG"        ;;
                \?)     echo "$G_SYNOPSIS"
                        exit 0;;
        esac
done

re='^[0-9]+$'

printf "Performing DB/filesystem consistency check for:\n"
printf "%20s%30s\n" "user directory:" "[ $usersDirectory ]"
printf "%20s%30s\n" "user:" "[ $dbUser ]"
printf "%20s%30s\n" "name:" "[ $dbName ]"


while read a b c d
do
	feedDirectory="$usersDirectory/${a}/${b}/${c}-${d}"

	if ! [[ $d =~ $re ]]; 
        then
		echo "${d} is not anumber.... probably header of SQL table... skipping..."
        elif [ -d "$feedDirectory" ];
	then
		echo "$feedDirectory exists!"
	else
		echo "$feedDirectory DOES NOT exist!"
		while true; do
          		read -p "Do you wish to remove it from the DB [1] or add it to the file system [2] or ignore [3]?" yn </dev/tty
			case $yn in
				[1]* ) echo 'Deleting from the DB'; mysql -D $dbName -u $dbUser -e "$sqlDeleteFeedCommand$d;$sqlDeleteFeedDataCommand$d;$sqlDeleteFeedTagCommand$d;$sqlDeleteFeedMetaCommand$d;" -p; break;;
			        [2]* ) echo 'Adding to the FS'; sudo su $a -c "umask 022; mkdir -p $feedDirectory";break;;
			        [3]* ) echo 'Ignoring...'; break;;
			        * ) echo "Please answer 1, 2 or 3.";;
	                esac
	        done
	fi
done < <(mysql -D $dbName -u $dbUser -e "$sqlCommand" -p)
