#!/bin/sh
for i in $(env | grep AMC_)
do
    key=$(echo $i | cut -d '=' -f 1)
    value=$(echo $i | cut -d '=' -f 2-)
    echo $key=$value
    # sed All files
    # find /usr/share/nginx/html -type f -exec sed -i "s|${key}|${value}|g" '{}' +

    # sed JS and CSS only
    find /etc/nginx/conf.d/ -type f -name 'default.conf' -exec sed -i "s|${key}|${value}|g" '{}' +
done
echo 'done'