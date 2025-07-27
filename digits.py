import tensorflow as tf
import cv2
import numpy as np

MODEL = tf.keras.models.load_model("model.h5")

IMAGE_WIDTH = 28
IMAGE_HEIGHT = 28
NUM_CLASSES = 10

def preprocess_image(image):
    """
    Preprocess the input image for prediction.
    """

    pixels = np.array(image, dtype=np.float32)
    pixels = cv2.resize(pixels, (IMAGE_WIDTH, IMAGE_HEIGHT), interpolation=cv2.INTER_AREA)
    return pixels.reshape(1, IMAGE_WIDTH, IMAGE_HEIGHT, 1)
    

def predict_digit(pixels):
    """
    Predict the digit from the preprocessed image.
    """
    processed_image = preprocess_image(pixels)
    prediction = MODEL.predict(processed_image)
    print(prediction)
    predicted_class = np.argmax(prediction, axis=1)[0]
    return int(predicted_class)

# print(predict_digit(np.zeros((IMAGE_WIDTH, IMAGE_HEIGHT), dtype=np.uint8)))  # Example usage with a dummy image
