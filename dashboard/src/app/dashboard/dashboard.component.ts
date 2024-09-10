import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  themes: any[] = [];
  clients: any[] = [];
  rents: any[] = [];
  itens: any[] = [];
  addresses: any[] = [];
  barra: any[] = [];
  temaChartData: any[] = [];
  totalThemesChartData: any[] = [];
  totalClientsChartData: any[] = [];
  totalRevenue: number = 0;
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  
  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getThemes().subscribe(
      (data) => {
        this.themes = data;
        this.updateMostRentedThemes();
        this.updateTotalThemesChart();
        this.calculateTotalRevenue();
      },
      (error) => {
        console.error('Erro ao obter temas', error);
      }
    );
    this.apiService.getClients().subscribe(
      (data) => {
        this.clients = data;
        this.updateBarChartData();
        this.updateTotalClientsChart();
      },
      (error) => {
        console.error('Erro ao obter clientes', error);
      }
    );
    this.apiService.getRents().subscribe(
      (data) => {
        this.rents = data;
        this.updateBarChartData();
        this.updateMostRentedThemes();
        this.calculateTotalRevenue();
      },
      (error) => {
        console.error('Erro ao obter alugueis', error);
      }
    );
    this.apiService.getItens().subscribe(
      (data) => {
        this.itens = data;
      },
      (error) => {
        console.error('Erro ao obter itens', error);
      }
    );
    this.apiService.getAddress().subscribe(
      (data) => {
        this.addresses = data;
      },
      (error) => {
        console.error('Erro ao obter endereços', error);
      }
    );
  }

  updateBarChartData() {
    // Verifique se os dados estão disponíveis
    if (this.clients.length > 0 && this.rents.length > 0) {
      // Cria um mapa para contar aluguéis por cliente
      const rentCountMap: { [key: string]: number } = {};
  
      // Conta o número de aluguéis para cada cliente
      this.rents.forEach(rent => {
        const clientId = rent.client;
        if (clientId) {
          rentCountMap[clientId] = (rentCountMap[clientId] || 0) + 1;
        }
      });
      console.log('Rent Count Map:', rentCountMap);
      // Mapeia os dados para o formato do gráfico
      this.barra = Object.keys(rentCountMap).map(clientId => {
        const count = rentCountMap[parseInt(clientId)];
        console.log('Client ID:', clientId);
        console.log('Count:', count);
        const client = this.clients.find(c => c.id === +clientId);
        return {
          name: client ? client.name : `Cliente ${clientId}`,
          value: count
        };
      });
  
      // Exibe os dados do gráfico no console
    }
  }
  updateMostRentedThemes() {
    if (this.themes.length > 0 && this.rents.length > 0) {
      // Cria um mapa para contar o número de aluguéis por tema
      const themeCountMap: { [key: number]: number } = {};
  
      // Contagem dos aluguéis por tema
      this.rents.forEach(rent => {
        const themeId = rent.theme;
        if (themeId) {
          // Atualiza a contagem no mapa
          themeCountMap[themeId] = (themeCountMap[themeId] || 0) + 1;
        }
      });
  
      // Log dos dados intermediários para depuração
      console.log('Theme Count Map:', themeCountMap);
  
      // Mapeia os dados para o formato do gráfico
      this.temaChartData = Object.keys(themeCountMap).map(themeId => {
        const count = themeCountMap[parseInt(themeId)];
        const theme = this.themes.find(t => t.id === +themeId);
        return {
          name: theme ? theme.name : `Tema ${themeId}`,
          value: count
        };
      });
  
      // Log dos dados processados para depuração
      console.log('Theme Chart Data:', this.temaChartData);
    }
  }

  updateTotalThemesChart() {
    if (this.themes.length > 0) {
      this.totalThemesChartData = this.themes.map(theme => ({
        name: 'Quantida de Temas cadastrados',
        value: this.themes.length // Cada tema é contado como 1
      }));
    }
} 
updateTotalClientsChart() {
  if (this.clients.length > 0) {
    this.totalClientsChartData = this.clients.map(theme => ({
      name: 'Quantida de Clientes cadastrados',
      value: this.clients.length // Cada tema é contado como 1
    }));
  }
} 
private calculateTotalRevenue(): void {
    this.totalRevenue = 0;

    // Itera sobre aluguéis para somar a receita total
    this.rents.forEach(rent => {
      const theme = this.themes.find(t => t.id === rent.theme);
      if (theme) {
        this.totalRevenue += theme.price;
      }
    });
  }
}
