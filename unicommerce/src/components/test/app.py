from flask import Flask, request, jsonify
import torch
from transformers import GPT2LMHeadModel, GPT2Tokenizer

app = Flask(__name__)

model_name = 'gpt2-medium'
tokenizer = GPT2Tokenizer.from_pretrained(model_name)
model = GPT2LMHeadModel.from_pretrained(model_name)

@app.route('/generate-caption', methods=['POST'])
def generate_caption():
    data = request.json
    product_name = data['productName']
    keyword = data['keyword']
    
    prompt = f"Create a caption for a product called '{product_name}' with the keyword '{keyword}':"
    inputs = tokenizer.encode(prompt, return_tensors='pt')
    
    outputs = model.generate(
        inputs,
        max_length=100,
        num_return_sequences=1,
        no_repeat_ngram_size=2,
        do_sample=True,
        top_k=50,
        top_p=0.95,
        temperature=0.7
    )
    
    generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    caption = generated_text.replace(prompt, '').strip()
    
    return jsonify({'caption': caption})

if __name__ == '__main__':
    app.run(port=5001)
