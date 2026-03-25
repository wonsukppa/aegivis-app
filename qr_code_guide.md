# 가이드: 현장 체크인용 QR 코드 생성 및 운용

현장에 부착할 QR 코드는 요원의 스마트폰 앱과 중앙 서버를 잇는 중요한 연결 고리입니다. QR 코드를 생성하고 관리하는 표준 방법을 안내합니다.

## 1. QR 코드에 담길 정보 (데이터 규격)
QR 코드는 단순히 텍스트를 담을 수도 있지만, 향후 모바일 앱과의 연동을 위해 **지점 고유 ID**를 포함한 URL 형식을 권장합니다.

*   **권장 형식**: `https://aegivis.ezvis.co.kr/checkin?site_id=[지점코드]`
*   **예시 (강남 지점)**: `https://aegivis.ezvis.co.kr/checkin?site_id=GN-UD-01`
    *   앱이 이 QR을 스캔하면 `GN-UD-01` 코드를 추출하여 서버에 "홍길동 요원이 이 지점에 도착함"이라고 알리게 됩니다.

## 2. QR 코드 생성 방법

### 방법 A: 온라인 생성 도구 활용 (가장 간편)
프로그래밍 없이 웹사이트에서 즉시 생성할 수 있습니다.
1.  [QR Code Generator](https://www.qr-code-generator.com/) 또는 [네이버 QR코드](https://qr.naver.com/) 접속
2.  'URL' 또는 '텍스트' 유형 선택
3.  위에서 정의한 지점별 URL 입력
4.  이미지(PNG/JPG)로 다운로드 후 출력

### 방법 B: 파이썬(Python) 라이브러리 활용 (대량 생성 시)
수십 개의 지점 코드를 한꺼번에 만들 때 유용합니다.
```bash
pip install qrcode[pil]
```
```python
import qrcode

# 지점별 ID 리스트
sites = {
    "강남": "GN-UD-01",
    "마포": "MP-UD-07"
}

for name, site_id in sites.items():
    url = f"https://aegivis.ezvis.co.kr/checkin?site_id={site_id}"
    img = qrcode.make(url)
    img.save(f"QR_{name}.png")
```

## 3. 현장 부착 및 관리 팁
- **재질**: 실외 환경(습기, 햇빛)에 강한 라벨지나 금속 명판 형태로 제작하는 것이 좋습니다.
- **위치**: 요원이 접근하기 쉽고 카메라 초점을 맞추기 용이한 배전반 외부나 시설물 입구에 부착합니다.
- **크기**: 최소 3cm x 3cm 이상의 크기를 권장합니다 (인식률 확보).
