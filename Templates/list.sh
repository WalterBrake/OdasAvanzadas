for folders in MA1T3 MA2T3 CM2T3 ES2T3 ES3T3 
do
    mkdir $folders
done


for value in MA1T3/165 MA1T3/169 MA2T3/213 CM2T3/291 ES2T3/95 ES3T3/80 MA2T3/216
do
    echo $value
    cp -R tempPug/ $value
done