from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import pickle
import os
import numpy as np
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Global variables
model_path = 'ml_model/budget_model.pkl'
data_path = 'static/data/sample_expenses.csv'

@app.route('/api/expenses', methods=['POST'])
def add_expense():
    data = request.json
    try:
        # In a real app, you would save to a database
        df = pd.read_csv(data_path)
        new_row = pd.DataFrame([{
            'date': data['date'],
            'category': data['category'],
            'amount': float(data['amount']),
            'description': data.get('description', '')
        }])
        df = pd.concat([df, new_row], ignore_index=True)
        df.to_csv(data_path, index=False)
        return jsonify({'message': 'Expense added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/expenses', methods=['GET'])
def get_expenses():
    try:
        df = pd.read_csv(data_path)
        return jsonify(df.to_dict('records'))
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/analyze', methods=['GET'])
def analyze_expenses():
    try:
        df = pd.read_csv(data_path)
        
        # Basic analysis
        total_spent = df['amount'].sum()
        by_category = df.groupby('category')['amount'].sum().to_dict()
        avg_daily = df.groupby('date')['amount'].sum().mean()
        
        # Load or train model
        if not os.path.exists(model_path):
            train_model()
        
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
        
        # Prepare data for prediction
        df['date'] = pd.to_datetime(df['date'])
        df['day_of_week'] = df['date'].dt.dayofweek
        df['day_of_month'] = df['date'].dt.day
        
        # Predict next month's spending
        future_dates = pd.date_range(start=df['date'].max(), periods=30, freq='D')
        future_data = pd.DataFrame({
            'day_of_week': future_dates.dayofweek,
            'day_of_month': future_dates.day
        })
        predicted_amounts = model.predict(future_data[['day_of_week', 'day_of_month']])
        
        # Generate suggestions
        suggestions = generate_suggestions(by_category, total_spent)
        
        return jsonify({
            'total_spent': total_spent,
            'by_category': by_category,
            'avg_daily': avg_daily,
            'predicted_next_month': predicted_amounts.sum(),
            'suggestions': suggestions
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

def generate_suggestions(category_spending, total_spent):
    suggestions = []
    avg_spending = total_spent / len(category_spending)
    
    for category, amount in category_spending.items():
        if amount > avg_spending * 1.5:
            reduction = round((amount - avg_spending) / amount * 100)
            suggestions.append(
                f"You're spending {amount} on {category} which is {reduction}% above average. "
                f"Consider reducing this by {min(reduction, 20)}% next month."
            )
    
    if not suggestions:
        suggestions.append("Your spending is well balanced across categories. Good job!")
    
    if total_spent > 0.7 * 5000:  # Assuming $5000 is monthly income for demo
        savings_advice = (
            "You're spending a significant portion of your income. "
            "Consider setting aside at least 20% for savings."
        )
        suggestions.append(savings_advice)
    
    return suggestions

def train_model():
    try:
        df = pd.read_csv(data_path)
        df['date'] = pd.to_datetime(df['date'])
        
        # Feature engineering
        daily_totals = df.groupby('date')['amount'].sum().reset_index()
        daily_totals['day_of_week'] = daily_totals['date'].dt.dayofweek
        daily_totals['day_of_month'] = daily_totals['date'].dt.day
        
        X = daily_totals[['day_of_week', 'day_of_month']]
        y = daily_totals['amount']
        
        # Train model
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X, y)
        
        # Save model
        os.makedirs(os.path.dirname(model_path), exist_ok=True)
        with open(model_path, 'wb') as f:
            pickle.dump(model, f)
            
    except Exception as e:
        print(f"Error training model: {e}")

if __name__ == '__main__':
    # Ensure model is trained when server starts
    if not os.path.exists(model_path):
        train_model()
    app.run(debug=True)