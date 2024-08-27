import pdfplumber
import re
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime
import os

def extract_data_from_pdf(file_path):
    data = []
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            # Adjust this regex pattern to match your specific PDF format
            matches = re.findall(r'(\w+ \d{4})\s+(\d+(?:,\d+)*(?:\.\d+)?)', text)
            for match in matches:
                date = datetime.strptime(match[0], '%B %Y')
                amount = float(match[1].replace(',', ''))
                data.append((date, amount))
    return data

def process_data(data_list):
    df = pd.DataFrame(data_list, columns=['Date', 'Amount'])
    df.sort_values('Date', inplace=True)
    df.set_index('Date', inplace=True)
    return df

def plot_data(df):
    plt.figure(figsize=(12, 6))
    plt.plot(df.index, df['Amount'])
    plt.title('Investment Amount Over Time')
    plt.xlabel('Date')
    plt.ylabel('Amount')
    plt.grid(True)
    plt.tight_layout()
    plt.savefig('investment_plot.png')
    plt.close()

def main():
    data = []
    pdf_directory = 'path/to/your/pdf/directory'  # Update this path
    for filename in os.listdir(pdf_directory):
        if filename.endswith('.pdf'):
            file_path = os.path.join(pdf_directory, filename)
            data.extend(extract_data_from_pdf(file_path))
    
    df = process_data(data)
    plot_data(df)
    print("Graph has been saved as 'investment_plot.png'")

if __name__ == "__main__":
    main()
