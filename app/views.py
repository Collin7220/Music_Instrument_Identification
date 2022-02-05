from django.shortcuts import render
from prediction import *
# Create your views here.

from django.http import JsonResponse
from django.core.files.storage import default_storage

def getPrediction(request):


    # get the text file
    file = request.FILES["file"]

    print(file)

    file_name = default_storage.save(file.name, file)

    #  Reading file from storage
    file = default_storage.open(file_name)
    file_url = default_storage.url(file_name)

    my_genre = predict_instrument("."+file_url)

    print(my_genre)

    return JsonResponse({"genre":my_genre})



def getPredictionAdmin(file_url):
    my_genre = predict_instrument(file_url)
    return my_genre


def getFilePath(request):


    # get the text file
    file = request.FILES["file"]

    print(file)

    file_name = default_storage.save(file.name, file)

    #  Reading file from storage
    file = default_storage.open(file_name)
    file_url = default_storage.url(file_name)

    return JsonResponse({"path":file_url})
