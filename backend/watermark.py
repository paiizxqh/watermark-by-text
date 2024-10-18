from flask import Flask, request, jsonify, send_file
import cv2
import numpy as np
import os
from io import BytesIO
from PIL import Image
from flask_cors import CORS
from hashlib import sha256
from stegano import lsb
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
import base64

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])

def encrypt_message(message, key):
    key = key.encode('utf-8')  # แปลงคีย์เป็นไบต์
    cipher = AES.new(key, AES.MODE_CBC)
    iv = cipher.iv
    encrypted_message = cipher.encrypt(pad(message.encode(), AES.block_size))
    return base64.b64encode(iv + encrypted_message).decode('utf-8')

def hide_message_in_image(image_path, encrypted_message, output_image_path):
    image_with_secret = lsb.hide(image_path, encrypted_message)
    image_with_secret.save(output_image_path)

def create_rotated_text_image(width, height, text):
    image = np.zeros((height, width, 4), dtype="uint8")
    font = cv2.FONT_HERSHEY_SIMPLEX
    font_scale = 0.7 * (width / 500)
    color = (255, 255, 255, 255)
    thickness = 2
    positions = []
    start = int(height * 0.1)
    gap = int(height * 0.2)

    for i in range(5):
        positions.append((10, start))
        positions.append((width // 2 - 100, start))
        positions.append((width - 200, start))
        start += gap

    for pos in positions:
        cv2.putText(image, text, pos, font, font_scale, color, thickness, cv2.LINE_AA)

    center = (image.shape[1] // 2, image.shape[0] // 2)
    angle = 45
    rotation_matrix = cv2.getRotationMatrix2D(center, angle, 1.0)
    rotated_image = cv2.warpAffine(image, rotation_matrix, (image.shape[1], image.shape[0]), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=(0, 0, 0, 0))

    return rotated_image

def add_watermark(image, mark):
    if image.shape[2] == 3:
        image = cv2.cvtColor(image, cv2.COLOR_BGR2BGRA)

    alpha_mask = mark[:, :, 3] / 255.0
    alpha_inverse = 1.0 - alpha_mask

    for c in range(0, 3):
        image[:, :, c] = (alpha_inverse * image[:, :, c] + alpha_mask * mark[:, :, c])

    return image

@app.route('/watermark', methods=['POST'])
def watermark_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    file = request.files['image']
    text = request.form.get('username', 'User')  # ใช้ 'aaaa' เป็นค่าเริ่มต้นถ้าไม่มีการระบุ  # ข้อความลายน้ำ, ถ้าไม่ใส่ใช้ค่า default
    key = 'qwertyuiopasdfgh'
    # อ่านภาพจากไฟล์ที่อัปโหลด
    image = Image.open(file.stream)
    image_np = np.array(image)

    if image_np.shape[2] == 4:
        image_np = cv2.cvtColor(image_np, cv2.COLOR_RGBA2BGRA)
    else:
        image_np = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGRA)

    # สร้างลายน้ำ
    h, w = image_np.shape[:2]
    mark = create_rotated_text_image(w, h, text)
    

    # ใส่ลายน้ำลงในภาพ
    watermarked_image = add_watermark(image_np, mark)

    watermarked_image_rgb = cv2.cvtColor(watermarked_image, cv2.COLOR_BGRA2RGBA)

    # แปลงภาพกลับเป็น PIL เพื่อเตรียมส่งกลับไป
    watermarked_pil = Image.fromarray(watermarked_image_rgb)

    # บันทึกเป็นไฟล์ในหน่วยความจำแบบชั่วคราว
    buffer = BytesIO()
    watermarked_pil.save(buffer, format="PNG")
    buffer.seek(0)

    ####
    temp_image_path = 'temp_image.png'
    watermarked_pil.save(temp_image_path)

    # เข้ารหัสข้อความลับ
    encrypted_message = encrypt_message(text, key)

    # ฝังข้อความเข้ารหัสลงในภาพ
    output_image_path = 'output_image.png'
    hide_message_in_image(temp_image_path, encrypted_message, output_image_path)

    # ส่งไฟล์ภาพกลับไปเป็นไฟล์แนบ
    return send_file(output_image_path, mimetype='image/png', as_attachment=True, download_name='watermarked_and_encrypted_image.png')
    ####
    # ส่งไฟล์ภาพกลับไปเป็นไฟล์แนบ
    # return send_file(buffer, mimetype='image/png', as_attachment=True, download_name='watermarked_image.png')

if __name__ == '__main__':
    app.run(port=4000, debug=True)