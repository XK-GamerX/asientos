interface Seat {
    id: number;
    name: string | null;
    row: number;
    col: number;
  }
  
  class CinemaSeating {
    private seats: Seat[] = [];
    private selectedSeatId: number | null = null;
    private isAdmin: boolean = false;
    private readonly ROWS = 7;
    private readonly COLS = 8;
    private readonly ADMIN_PASSWORD = 'admin123'; // Change this in production!
  
    constructor() {
      this.initializeSeats();
      this.setupEventListeners();
      this.renderSeats(); // Ensure initial render
    }
  
    private initializeSeats(): void {
      for (let row = 0; row < this.ROWS; row++) {
        for (let col = 0; col < this.COLS; col++) {
          this.seats.push({
            id: row * this.COLS + col,
            name: null,
            row,
            col
          });
        }
      }
      this.loadSeatsFromStorage();
    }
  
    private setupEventListeners(): void {
      const startButton = document.getElementById('startSelection');
      const adminLoginButton = document.getElementById('adminLogin');
      const nameInput = document.getElementById('userName') as HTMLInputElement;
      const adminPassword = document.getElementById('adminPassword') as HTMLInputElement;
  
      if (startButton) {
        startButton.addEventListener('click', () => this.handleSeatSelection());
      }
  
      if (adminLoginButton) {
        adminLoginButton.addEventListener('click', () => this.handleAdminLogin());
      }
  
      if (nameInput) {
        nameInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') this.handleSeatSelection();
        });
      }
  
      // Show admin controls with special key combination (Ctrl + Shift + A)
      document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
          const adminControls = document.getElementById('adminControls');
          if (adminControls) {
            adminControls.style.display = adminControls.style.display === 'none' ? 'block' : 'none';
          }
        }
      });
    }
  
    private handleSeatSelection(): void {
      const nameInput = document.getElementById('userName') as HTMLInputElement;
      const name = nameInput.value.trim();
  
      if (!name) {
        this.showToast('Please enter your name first!', 'error');
        return;
      }
  
      const nameEntry = document.getElementById('nameEntry');
      if (nameEntry) {
        nameEntry.style.display = 'none';
        setTimeout(() => nameEntry.style.display = 'block', 100); // Show it again after selection
      }
  
      this.showToast(`Welcome ${name}! Please select your seat.`, 'success');
    }
  
    private handleAdminLogin(): void {
      const passwordInput = document.getElementById('adminPassword') as HTMLInputElement;
      const password = passwordInput.value;
  
      if (password === this.ADMIN_PASSWORD) {
        this.isAdmin = true;
        this.showToast('Admin mode activated!', 'success');
        passwordInput.value = '';
        const adminControls = document.getElementById('adminControls');
        if (adminControls) {
          adminControls.style.display = 'none';
        }
      } else {
        this.showToast('Invalid password!', 'error');
      }
    }
  
    private handleSeatClick(seatId: number): void {
      const seat = this.seats[seatId];
      const nameInput = document.getElementById('userName') as HTMLInputElement;
      const name = nameInput.value.trim();
  
      if (!name && !this.isAdmin) {
        this.showToast('Please enter your name first!', 'error');
        return;
      }
  
      if (this.isAdmin) {
        if (seat.name) {
          seat.name = null;
          this.showToast('Seat cleared by admin', 'success');
        }
      } else {
        if (seat.name && seat.name !== name) {
          this.showToast('This seat is already taken!', 'error');
          return;
        }
  
        if (this.selectedSeatId !== null && this.selectedSeatId !== seatId) {
          const prevSeat = this.seats[this.selectedSeatId];
          if (prevSeat.name === name) {
            prevSeat.name = null;
          }
        }
  
        seat.name = name;
        this.selectedSeatId = seatId;
        this.showToast(`Seat selected for ${name}`, 'success');
      }
  
      this.saveSeatsToStorage();
      this.renderSeats();
    }
  
    private renderSeats(): void {
      const grid = document.getElementById('seatingGrid');
      if (!grid) return;
  
      grid.innerHTML = '';
      grid.style.display = 'grid';
      grid.style.gridTemplateColumns = `repeat(${this.COLS}, 1fr)`;
  
      this.seats.forEach(seat => {
        const seatElement = document.createElement('div');
        seatElement.className = `seat ${seat.name ? 'occupied' : 'available'}`;
        
        if (seat.name) {
          seatElement.setAttribute('data-name', seat.name);
        }
  
        seatElement.addEventListener('click', () => this.handleSeatClick(seat.id));
        grid.appendChild(seatElement);
      });
    }
  
    private saveSeatsToStorage(): void {
      localStorage.setItem('cinemaSeats', JSON.stringify(this.seats));
    }
  
    private loadSeatsFromStorage(): void {
      const savedSeats = localStorage.getItem('cinemaSeats');
      if (savedSeats) {
        this.seats = JSON.parse(savedSeats);
      }
    }
  
    private showToast(message: string, type: 'success' | 'error'): void {
      const existingToast = document.querySelector('.toast');
      if (existingToast) {
        existingToast.remove();
      }
  
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.textContent = message;
      document.body.appendChild(toast);
  
      setTimeout(() => {
        toast.remove();
      }, 3000);
    }
  }
  
  // Initialize the application
  new CinemaSeating();