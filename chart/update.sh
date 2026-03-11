#!/bin/bash

helm upgrade -n pagemilling pagemilling pagemilling
kubectl rollout restart deployment -n pagemilling
