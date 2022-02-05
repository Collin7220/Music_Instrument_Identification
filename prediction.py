import math
import json
import yaml
import librosa
import logging
import argparse
import numpy as np
import classify
import pickle
from collections import namedtuple
from sklearn.neighbors import KNeighborsClassifier
import traceback

logger = logging.getLogger()

dataset_labels = {
	9:"flute",
	11:"guitar",
	17:"trumpet",
	20:"violin"
}

class Model:
    def __init__(self, knn, loglevel):
        """initializing knn, loglevel instance, config file, and dataset name file"""

        self.knn = knn
        logger = loglevel

        with open('../_config.yml', 'r') as outfile:
            try:
                self.read_yml = yaml.load(outfile)

            except yaml.YAMLError as error:
                logger.error('[/!/] _config.yml file not found:', error)
        
        jsonfile = self.read_yml['_dataset']+"/"+self.read_yml['_dataFolderNames']+".json"
        with open(jsonfile, 'r') as outfile:
            try:
                self.dataset_names = json.load(outfile)

            except FileNotFoundError:
                logger.error('[/!/] dataset labels not found')

    def model(self):
        """main model, with supervised machine learning; calls to process datasets"""

        logger.info('[*] Starting processing of dataset ...')
        
        cl = classify.Classify(logger)
        data = cl.get_dataset()

        logger.info('[*] Using K-nearest neighbour algorithm ...')
        
        self.knn_model = KNeighborsClassifier(n_neighbors = self.knn)
        self.train_and_test(data)

        return True

    def train_and_test(self, data):
        """begins the training and testing model"""

        np.random.shuffle(data)
        datalist = self.unpack_data(data)

        logger.info('[*] 75-25 partition of datasets ...')

        markline1 = math.floor(0.75*(len(datalist['features'])))
        markline2 = math.floor(0.75*len(datalist['labels']))

        train_features = datalist['features'][:(markline1)]
        test_features = datalist['features'][(markline1):]
        
        train_labels = datalist['labels'][:(markline2)]
        test_labels = datalist['labels'][(markline2):]

        logger.info('[*] Training started with 75% Dataset ...')

        self.knn_model.fit(train_features, train_labels)

        logger.info('[*] Testing started with 25% Dataset ...')
        print('\n/---------------Accuracy----------------/') 
        
        accuracy = self.knn_model.score(train_features, train_labels)
        print('Test set accuracy {:.2f} %'.format(accuracy*100))

        if accuracy < 0.40:
            logger.warning('[-.-!] Thanks for tryin\' but this machine ain\'t learning.')

        return True

    def train(self, data):
        """training with full dataset, without testing"""
        
        logger('[.] Training with whole dataset ...')
        
        datalist = self.unpack_data(data)
        self.knn_model.fit(datatuple['features'], datatuple['labels'])

    def prediction(self, filepath):
        """prediction of the new audio input / filepath to that"""
        print(filepath)
        print("====================>")
        try:
            DTFTarray, sampling_rate = librosa.load(filepath)
        except Exception as e:
            print(e)
            traceback.print_exc()
            logger.error('[/!/] Librosa loading test file failed.')

        def get_silence(DTFTarray, threshold=0.001):
            """find the position till which audio is silent, default threshold=0.001"""

            trim = 0

            DTFTarray = DTFTarray / max(DTFTarray)
            DTFTarray = np.array(DTFTarray)

            for i in range(len(DTFTarray)):
                if DTFTarray[trim] < threshold:
                    trim += 1

            return trim

        begin_silence = get_silence(DTFTarray)
        end_silence = get_silence(np.flipud(DTFTarray))

        logger.info('[.] Trimming the audio ...')

        DTFTarray_trimmed = DTFTarray[begin_silence: (len(DTFTarray) - end_silence)]

        mfccs = librosa.feature.mfcc(y=DTFTarray_trimmed, sr=sampling_rate)
        average = np.mean(mfccs, axis=1)
        
        features = average.reshape(20)

        logger.info('[.] Predicting with the audio features ...')
        predicted = self.knn_model.predict([features])
        print(predicted)
        #inv_dataset_names = {value: key for key, value in self.dataset_names.items()}

        #label_predicted = inv_dataset_names[predicted]
        #print('[*] Prediction: The audio relates to ', label_predicted)

        return dataset_labels[predicted[0]]



    def unpack_data(self, data):        
        """unpacking data from list to numpy array; returning in namedtuple from collections"""

        datadict = {'filenames': [], 'features': [], 'labels': [] }

        for l in data:
            
            datadict['filenames'].append(l[0])
            datadict['features'].append(l[1])
            datadict['labels'].append(l[2])
        
        return datadict


def make_prediction(filepath,knn_model):
        """prediction of the new audio input / filepath to that"""

        try:
            DTFTarray, sampling_rate = librosa.load(filepath)
        except Exception as e:
            logger.error('[/!/] Librosa loading test file failed.')


        def get_silence(DTFTarray, threshold=0.001):
            """find the position till which audio is silent, default threshold=0.001"""

            trim = 0

            DTFTarray = DTFTarray / max(DTFTarray)
            DTFTarray = np.array(DTFTarray)

            for i in range(len(DTFTarray)):
                if DTFTarray[trim] < threshold:
                    trim += 1

            return trim
        begin_silence = get_silence(DTFTarray)
        end_silence = get_silence(np.flipud(DTFTarray))

        logger.info('[.] Trimming the audio ...')

        DTFTarray_trimmed = DTFTarray[begin_silence: (len(DTFTarray) - end_silence)]

        mfccs = librosa.feature.mfcc(y=DTFTarray_trimmed, sr=sampling_rate)
        average = np.mean(mfccs, axis=1)

        features = average.reshape(20)

        logger.info('[.] Predicting with the audio features ...')
        #predicted = knn_model.prediction(datatuple.features)
        predicted = knn_model.prediction(None)

        inv_dataset_names = {value: key for key, value in self.dataset_names.items()}

        label_predicted = inv_dataset_names[predicted]
        print('[*] Prediction: The audio relates to ', label_predicted)

        return True

def predict_instrument(filepath):
    #filepath = 'training/test.mp3'
    filename = 'prediction_model.sav'
    print(open(filename, 'rb'))
    knn_model = pickle.load(open(filename, 'rb'))
    return knn_model.prediction(filepath)

def main():
    filepath = 'training/test2.mp3'
    filename = 'prediction_model.sav'
    knn_model = pickle.load(open(filename, 'rb'))
    knn_model.prediction(filepath)


