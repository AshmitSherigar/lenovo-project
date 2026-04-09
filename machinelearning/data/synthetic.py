import pandas as pd
import numpy as np

def generate_telemetry_data(n_points=1000, seed=42):
    np.random.seed(seed)
    servers = ['S1', 'S2', 'S3']
    
    timestamps = pd.date_range(start="2026-01-01", periods=n_points, freq="5min")
    
    all_server_data = []

    for server in servers:
        # Base patterns
        base_power = 120 + 30 * np.sin(np.linspace(0, 20*np.pi, n_points))
        base_cpu = 50 + 20 * np.sin(np.linspace(0, 15*np.pi, n_points))
        base_memory = 60 + 15 * np.sin(np.linspace(0, 10*np.pi, n_points))
        
        # Add noise
        power = base_power + np.random.normal(0, 5, n_points)
        cpu = base_cpu + np.random.normal(0, 5, n_points)
        memory = base_memory + np.random.normal(0, 5, n_points)
        
        # Slight variation per server
        if server == 'S2':
            power += 10; cpu -= 5
        elif server == 'S3':
            power -= 10; memory += 5
            
        # Anomalies
        anomaly_idx = np.random.choice(n_points, size=10, replace=False)
        
        # Dips
        power[anomaly_idx[:5]] *= 0.3
        cpu[anomaly_idx[:5]] *= 0.2
        memory[anomaly_idx[:5]] *= 0.5
        
        # Spikes
        power[anomaly_idx[5:]] *= 1.7
        cpu[anomaly_idx[5:]] *= 1.5
        memory[anomaly_idx[5:]] *= 1.3

        # VECTORIZED BOUNDS: Instantly clip values without a loop
        cpu = np.clip(cpu, 0, 100)
        memory = np.clip(memory, 0, 100)
        power = np.clip(power, 0, None) # 0 to infinity
        
        # Create DataFrame directly from the arrays
        df_server = pd.DataFrame({
            'Timestamp': timestamps,
            'Server_ID': server,
            'CPU_Utilization_%': cpu,
            'Memory_Utilization_%': memory,
            'Power_Usage_Watts': power
        })
        
        all_server_data.append(df_server)

    # Combine all server dataframes into one
    df_final = pd.concat(all_server_data, ignore_index=True)
    return df_final


if __name__ == "__main__":
    df = generate_telemetry_data(n_points=1000)
    df.to_csv("realistic_power_emergency_dataset.csv", index=False)
    print("Dataset generated successfully!")