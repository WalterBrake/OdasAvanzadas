#for folders in CM1T3 CM2T3 CN3T3 CN4T3 CN5T3 CN6T3 ES1T3 ES4T3 ES5T3 ES6T3 GE4T3 GE5T3 GE6T3 HI4T3 HI5T3 HI6T3 MA3T3 MA4T3 MA5T3 MA6T3
#do
#    mkdir $folders
#done


for value in ../ES2T3/117 ../ES2T3/115 ../MA4T3/163 ../HI4T3/284 ../ES6T3/78 ../ES6T3/75
do
    echo $value
    cp -R tempPug/ $value
done