#!/bin/bash

G_SYNOPSIS="
	
  NAME
  
  	chris_switchIcons.bash

  SYNOPSIS
  
  	chris_switchIcons.bash [-p] [-s <chrisSrcDir>] <newIconSet>
	
  DESCRIPTION
  
  	'chris_switchIcons.bash' will switch, or swap out, a the current iconset in
	ChRIS to <newIconSet>. The current iconSet is preserved in 
	'currentIconSet-$(date)' if the '-p' flag is passed.
	
  ARGS
  
  	-p
	Preserve the current iconSet in 'currentIconSet-$(date)'. This will make 
	a backup of the *png and *.xcf files in the current iconset.
	
	-s <chrisSrcDir>
	Specify the location of the chris source directory.
		
"

declare -i b_preserve=0

G_SRCREPONAME=chrisreloaded

SRCPREFIX=$(pwd | awk -F chrisreloaded '{print $1}')
if (( ! ${#SRCPREFIX} )) ; then
	G_CHRISSRCDIR=""
else
	G_CHRISSRCDIR="${SRCPREFIX}/chrisreloaded"
fi
G_PLUGINDIR=${G_CHRISSRCDIR}/plugins

###\\\
# Process command options
###///

while getopts ps: option ; do 
	case "$option"
	in
                p)      let b_preserve=1	;;
		s)	G_CHRISSRCDIR=$OPTARG	;;
		\?)     echo "$G_SYNOPSIS" 
                        exit 0;;
	esac
done

if [[ ! -d $G_CHRISSRCDIR ]] ; then
	printf "\n"
	printf "ChRIS src directory not found.\n"
	printf "\n"
	printf "Type 'chris_switchIcons.bash' with no arguments for help.\n"
	exit 1
fi

G_ICONSETREPODIR=${G_PLUGINDIR}/iconSets

shift $(($OPTIND - 1))

if [ "$#" = 0 ] ; then
	echo "$G_SYNOPSIS"
fi
NEWICONSET=$1

if (( !${#NEWICONSET} )) ; then
	printf "\n"
	printf "newIconSet not specified. You MUST specify an icon set name.\n"
	printf "\n"
	printf "Type 'chris_switchIcons.bash' with no arguments for help.\n"
	exit 1
fi

PDIR=${G_ICONSETREPODIR}/currentIconSet-$(date +"%Y%m%d-%H%M")
NDIR=${G_ICONSETREPODIR}/$NEWICONSET

if [[ ! -d $NDIR ]] ; then
	printf "\n"
	printf "newIconSet not found. Does this icon set exist?\n"
	printf "It must be located in the chris src dir, plugins subdir.\n"
	printf "Currently, this is set to -->$NDIR<--.\n"
	printf "\n"
	printf "Type 'chris_switchIcons.bash' with no arguments for help.\n"
	exit 1
fi

if (( b_preserve )) ; then
	mkdir -p $PDIR
fi

topDir=$(pwd)
cd $G_PLUGINDIR
for c in * ; do
	if [[ -f $c/feed.png || -f $c/plugin.png ]] ; then
		if (( b_preserve )) ; then
			mkdir -p ${PDIR}/$c
			for imageFile in feed plugin ; do
				for ext in png xcf ; do
					if [[ -f $c/$imageFile.$ext ]] ; then
						printf "%65s" "Preserving current $imageFile.$ext from $c"
						#printf "\nmv $c/$imageFile.$ext ${PDIR}/$c\n"
						mv $c/$imageFile.$ext ${PDIR}/$c
						printf "%15s\n" "[ ok ]"
					fi
				done
			done
		fi
		for imageFile in feed plugin ; do
			for ext in png xcf ; do
				if [[ -f ${NDIR}/$c/$imageFile.$ext ]] ; then
					printf "%65s" "Copying $imageFile.$ext from $NEWICONSET $c"
					cp ${NDIR}/$c/$imageFile.$ext $c/$imageFile.$ext
					printf "%15s\n" "[ ok ]"
				fi
			done
		done
	fi
done
cd $topDir
