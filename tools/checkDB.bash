#! /bin/bash

dbUser="chris"
dbName="chrisdev"
usersDirectory="/neuro/users/chris/dev/users"

sqlCommand="SELECT user.username,feed.plugin,feed.name,feed.id FROM user JOIN feed ON user.id=feed.user_id;"
sqlDeleteFeedCommand="DELETE FROM feed WHERE feed.id="
sqlDeleteFeedDataCommand="DELETE FROM feed_data WHERE feed_data.feed_id="
sqlDeleteFeedTagCommand="DELETE FROM feed_tag WHERE feed_tag.feed_id="
sqlDeleteFeedMetaCommand="DELETE FROM meta WHERE meta.target_type=\"feed\" AND meta.target_id="

re='^[0-9]+$'

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
		echo "$feedDirectory DOESNT exists!"
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
