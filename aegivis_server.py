# Aegivis 3.0 Demo Server (aegivis_server.py)
# Flask 기반 로컬 서버 - HTML 대시보드 + 기상청 실시간 API 브릿지
# PyInstaller로 .exe 패키징 가능

import sys
import os
import json
import webbrowser
import threading
import requests as req
from datetime import datetime, timedelta
from flask import Flask, jsonify, send_from_directory

# PyInstaller 호환: 리소스 경로를 올바르게 가져오기
def resource_path(relative_path):
    if hasattr(sys, '_MEIPASS'):
        return os.path.join(sys._MEIPASS, relative_path)
    return os.path.join(os.path.dirname(os.path.abspath(__file__)), relative_path)

app = Flask(__name__, static_folder=resource_path('static'))

# ===================================================
# API Key Configuration
# ===================================================
KMA_SERVICE_KEY = "12f0713b4e46b4f7fd285ac730d3b610ca356e34c0e321b0729916676f9aae4d"

# ===================================================
# Routes
# ===================================================

@app.route('/')
def index():
    return send_from_directory(resource_path('static'), 'aegivis_screen1_emap.html')

@app.route('/aegivis_screen2_local.html')
def screen2():
    return send_from_directory(resource_path('static'), 'aegivis_screen2_local.html')

@app.route('/admin')
def admin_dash():
    return send_from_directory(resource_path('static'), 'aegivis_admin.html')

@app.route('/api/weather')
def get_weather():
    """기상청 초단기실황 API를 대리 호출하여 CORS 문제 없이 프론트엔드로 전달"""
    try:
        now = datetime.now()
        if now.minute < 45:
            now = now - timedelta(hours=1)

        base_date = now.strftime('%Y%m%d')
        base_time = now.strftime('%H00')
        nx, ny = 61, 127  # 서울 기준 격자

        url = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst"
        params = {
            'serviceKey': KMA_SERVICE_KEY,
            'pageNo': '1', 'numOfRows': '10',
            'dataType': 'JSON',
            'base_date': base_date, 'base_time': base_time,
            'nx': nx, 'ny': ny
        }

        r = req.get(url, params=params, timeout=10)
        data = r.json()

        result = {'rain_mm': 0.0, 'temperature': '--', 'status': '맑음', 'timestamp': datetime.now().strftime('%H:%M:%S')}

        if data.get('response', {}).get('header', {}).get('resultCode') == '00':
            for item in data['response']['body']['items']['item']:
                if item['category'] == 'RN1':
                    result['rain_mm'] = float(item['obsrValue'])
                elif item['category'] == 'T1H':
                    result['temperature'] = item['obsrValue']
                elif item['category'] == 'PTY':
                    pty_map = {0: '맑음', 1: '비', 2: '비/눈', 3: '눈', 4: '소나기'}
                    result['status'] = pty_map.get(int(item['obsrValue']), '맑음')

        return jsonify(result)

    except Exception as e:
        return jsonify({'rain_mm': 0.0, 'temperature': '--', 'status': '통신오류', 'error': str(e)})


def kill_port(port):
    """해당 포트를 사용하는 프로세스를 강제 종료"""
    import subprocess
    try:
        result = subprocess.run(
            f'for /f "tokens=5" %a in (\'netstat -aon ^| findstr :{port}\') do taskkill /F /PID %a',
            shell=True, capture_output=True
        )
    except Exception:
        pass


def open_browser(port):
    """서버 시작 후 자동으로 브라우저 열기"""
    import time
    time.sleep(1.5)
    webbrowser.open(f'http://127.0.0.1:{port}')


if __name__ == '__main__':
    PORT = 5000
    print("=" * 55)
    print("   Aegivis 3.0 Demo Server 시작 중...")
    print("=" * 55)
    print(f"  ▶ 기존 포트 {PORT} 점유 프로세스 정리 중...")
    kill_port(PORT)

    import time
    time.sleep(1)

    print(f"  ▶ 서버 주소: http://127.0.0.1:{PORT}")
    print("  ▶ 기상청 API 연동: 준비됨")
    print("  ▶ 창을 닫으면 서버가 종료됩니다.")
    print("=" * 55)

    threading.Thread(target=open_browser, args=(PORT,), daemon=True).start()
    app.run(host='0.0.0.0', port=PORT, debug=False)
