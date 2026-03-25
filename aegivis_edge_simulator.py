import json
import time
import random
from datetime import datetime

class AegivisEdgeSimulator:
    def __init__(self, site_id="GN-UD-01"):
        self.site_id = site_id
        self.base_level = 0.5  # Normal water level (m)
        self.rain_rate = 0.0   # Current rainfall (mm/h)
        self.plc_threshold = 15.0 # PLC contact at 15cm
        self.is_raining = False

    def get_radar_data(self):
        # Simulate radar water level with slight noise
        noise = random.uniform(-0.01, 0.01)
        if self.is_raining:
            self.base_level += (self.rain_rate / 3600.0) * 0.1 # Very simplified rise
        return round(self.base_level + noise, 3)

    def get_weather_sensor_data(self):
        # Simulate local rain sensor
        if self.is_raining:
            return round(self.rain_rate + random.uniform(-0.5, 0.5), 1)
        return 0.0

    def get_vision_data(self):
        # Simulate vision analysis (pixel change rate in ROI)
        if self.is_raining:
            return round(random.uniform(0.1, 0.5), 2)
        return round(random.uniform(0.01, 0.05), 2)

    def get_plc_contact(self, current_level_m):
        # 15cm = 0.15m
        return current_level_m >= (self.plc_threshold / 100.0)

    def generate_packet(self):
        current_level = self.get_radar_data()
        rain = self.get_weather_sensor_data()
        vision = self.get_vision_data()
        plc = self.get_plc_contact(current_level)

        # Simplified event logic for Edge-Cloud optimization
        status = "normal"
        if rain > 10.0 or current_level > 0.8 or plc:
            status = "event"

        packet = {
            "header": {
                "site_id": self.site_id,
                "timestamp": datetime.now().isoformat(),
                "msg_type": "sensor_update",
                "encryption": "TLS_v1.3_placeholder"
            },
            "body": {
                "radar_level_m": current_level,
                "rain_rate_mmh": rain,
                "vision_roi_score": vision,
                "plc_contact_15cm": plc,
                "status": status
            }
        }
        return packet

    def run_simulation(self, iterations=10):
        print(f"--- Starting Aegivis 3.0 Edge Simulator for {self.site_id} ---")
        print(f"--- Protocol: Secure MQTT (JSON) ---")
        
        # Scenario: Start raining after 3 steps
        for i in range(iterations):
            if i == 3:
                print("\n[SCENARIO] Heavy rain starts!\n")
                self.is_raining = True
                self.rain_rate = 50.0 # 50mm/h
            
            packet = self.generate_packet()
            print(f"[{datetime.now().strftime('%H:%M:%S')}] Sending Packet ({packet['body']['status']}):")
            print(json.dumps(packet, indent=4, ensure_ascii=False))
            time.sleep(1)

if __name__ == "__main__":
    sim = AegivisEdgeSimulator()
    sim.run_simulation(8)
