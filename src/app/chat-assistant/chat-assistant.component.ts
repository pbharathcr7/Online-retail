import { Component, OnInit } from '@angular/core'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-chat-assistant',
  templateUrl: './chat-assistant.component.html',
  styleUrls: ['./chat-assistant.component.css']
})
export class ChatAssistantComponent implements OnInit {
  private baseURL: string = 'https://models.inference.ai.azure.com';
  private apiKey: string = ''; 
  model: any;
  userMessage: string = '';
  chatHistory: { sender: string, text: string }[] = [];
  
  productList: any[] = [];
  orderList: any[] = [];
  productMap: { [key: string]: string } = {};
  chatOpen: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchBackendData();
  }

  fetchBackendData() {
    this.http.get<any[]>('https://uiexercise.theproindia.com/api/Product/GetAllProduct').subscribe({
      next:(data) =>{
      this.productList = data;
      this.productMap = data.reduce((accumulator, product) => {
        accumulator[product.ProductId] = product.ProductName;
        return accumulator;
      }, {} as { [key: string]: string });
  }});

    this.http.get<any[]>('https://uiexercise.theproindia.com/api/Order/GetAllOrder').subscribe({
      next:(data) => {
        this.orderList = data.map(order => ({
        OrderId: order.OrderId,
        ProductName: this.productMap[order.ProductId] || "Unknown Product",
        Quantity: order.Quantity,
        Status: order.IsCancel ? "Cancelled" : "Confirmed"
      }));
  }});
  }

  toggleChat() {
    this.chatOpen = !this.chatOpen;
  }

  async sendMessage() {
    if (!this.userMessage.trim()) return;

    const userText = this.userMessage;
    this.chatHistory.push({ sender: 'user', text: userText });
    this.userMessage = '';

    this.chatHistory.push({ sender: 'model', text: 'Typing...' });

    let context = '';
    if (userText.toLowerCase().includes("product")) {
      context = this.productList.length
        ? "Available Products: \n" + this.productList.map(p => `${p.ProductName} - Available: ${p.Quantity}`).join("\n")
        : "No products available.";
    } 
    else if (userText.toLowerCase().includes("order")) {
      context = this.orderList.length
        ? "Recent Orders: \n" + this.orderList.map(o => `Order #${o.OrderId}: ${o.ProductName} (Qty: ${o.Quantity}, Status: ${o.Status})`).join("\n")
        : "No recent orders found.";
    }

    const body = {
      messages: [
        { role: "system", content: "" },
        { role: "user", content: userText + "\n" + context }
      ],
      model: "gpt-4o-mini",
      temperature: 1,
      max_tokens: 4096,
      top_p: 1
    };

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    });

    this.http.post(`${this.baseURL}/chat/completions`, body, { headers })
    .subscribe({
      next: (result: any) => {
        console.log(result);
        this.chatHistory = this.chatHistory.filter(msg => msg.text !== 'Typing...');
        const modelResponse = result.choices[0].message.content || 'Sorry, something went wrong.';
        this.chatHistory.push({ sender: 'model', text: modelResponse });
      },
      error: (error) => {
        console.error("Error:", error);
        this.chatHistory.pop();
        this.chatHistory.push({ sender: 'model', text: 'Error: Could not send message.' });
      }
    });
  
  }
}
