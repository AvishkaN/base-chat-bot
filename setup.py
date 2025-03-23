import os
import shutil
import subprocess
import sys

def setup_project():
    print("Setting up Grok Chat Bot project...")
    
    # Check if Python is installed
    try:
        python_version = subprocess.check_output(["python", "--version"]).decode().strip()
        print(f"Found {python_version}")
    except:
        print("Python not found. Please install Python 3.7 or higher.")
        return
    
    # Check if Node.js is installed
    try:
        node_version = subprocess.check_output(["node", "--version"]).decode().strip()
        print(f"Found Node.js {node_version}")
    except:
        print("Node.js not found. Please install Node.js 14 or higher.")
        return
    
    # Create virtual environment
    print("\nCreating Python virtual environment...")
    try:
        subprocess.check_call([sys.executable, "-m", "venv", "venv"])
        print("Virtual environment created successfully.")
    except Exception as e:
        print(f"Failed to create virtual environment: {str(e)}")
        return
    
    # Activate virtual environment and install dependencies
    print("\nInstalling Python dependencies...")
    if os.name == 'nt':  # Windows
        pip_path = os.path.join("venv", "Scripts", "pip")
    else:  # macOS/Linux
        pip_path = os.path.join("venv", "bin", "pip")
    
    try:
        subprocess.check_call([pip_path, "install", "-r", "requirements.txt"])
        print("Python dependencies installed successfully.")
    except Exception as e:
        print(f"Failed to install Python dependencies: {str(e)}")
    
    # Set up .env file
    if not os.path.exists(".env"):
        print("\nSetting up environment variables...")
        shutil.copy(".env.example", ".env")
        print("Created .env file. Please edit it to add your Grok API key.")
    
    # Set up frontend
    print("\nSetting up React frontend...")
    try:
        os.chdir("frontend")
        subprocess.check_call(["npm", "install"])
        print("Frontend dependencies installed successfully.")
        os.chdir("..")
    except Exception as e:
        print(f"Failed to set up frontend: {str(e)}")
    
    print("\nSetup completed successfully!")
    print("\nTo start the application:")
    print("1. Activate the virtual environment:")
    if os.name == 'nt':  # Windows
        print("   venv\\Scripts\\activate")
    else:  # macOS/Linux
        print("   source venv/bin/activate")
    print("2. Start the backend server:")
    print("   python app.py")
    print("3. In a separate terminal, start the frontend:")
    print("   cd frontend")
    print("   npm start")
    print("\nOpen your browser and navigate to http://localhost:3000")

if __name__ == "__main__":
    setup_project() 