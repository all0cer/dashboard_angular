import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { FormBuilder, FormGroup, RequiredValidator, Validators } from '@angular/forms';
import { id } from '@swimlane/ngx-charts';
export type Usuario = { 
  id?: number;
  nome: string;
  email: string;
}

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
  rentByPeriod: any[] = [];
  revenueByPeriod: any[] = [];
  formUsuario: FormGroup;
  listaUsuarios: any[] = [];
  colorScheme = {
    name: 'custom',
    selectable: true,
    group: 'Ordinal',
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  
  
  constructor(private apiService: ApiService, private group: FormBuilder) {
    this.formUsuario = this.group.group({
       id: 0,
       nome: ['', Validators.required],
       email: []
    });
  }

  ngOnInit(): void {
    this.apiService.getThemes().subscribe(
      (data) => {
        this.themes = data;
        this.updateMostRentedThemes();
        this.updateTotalThemesChart();
        this.calculateTotalRevenue();
        this.updateThemesRentedByPeriod();
        this.updateRevenueByPeriod();
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
        this.submeterUsuario();
        this.lerUsuarios();
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
        this.updateThemesRentedByPeriod();
        this.updateRevenueByPeriod();
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

  updateThemesRentedByPeriod() {
    if (this.rents.length > 0) {
      // Mapeia os aluguéis para os meses (ou anos) de interesse
      const rentCountByPeriod: { [key: string]: number } = {};
      
      this.rents.forEach(rent => {
        const rentDate = new Date(rent.date); // Assumindo que você tem uma data associada a cada aluguel
        const monthYear = `${rentDate.getMonth() + 1}/${rentDate.getFullYear()}`; // Agrupa por mês/ano
  
        rentCountByPeriod[monthYear] = (rentCountByPeriod[monthYear] || 0) + 1;
      });
  
      // Mapeia os dados para o formato do gráfico
      this.rentByPeriod = Object.keys(rentCountByPeriod).map(period => ({
        name: period,
        value: rentCountByPeriod[period]
      }));
  
      console.log('Alugados por Período:', this.rentByPeriod);
    }
  }  

  updateRevenueByPeriod() {
    if (this.rents.length > 0 && this.themes.length > 0) {
      const revenueByPeriod: { [key: string]: number } = {};
      
      this.rents.forEach(rent => {
        const rentDate = new Date(rent.date);
        const monthYear = `${rentDate.getMonth() + 1}/${rentDate.getFullYear()}`;
  
        const theme = this.themes.find(t => t.id === rent.theme);
        if (theme) {
          revenueByPeriod[monthYear] = (revenueByPeriod[monthYear] || 0) + theme.price;
        }
      });
  
      // Mapeia os dados para o formato do gráfico
      this.revenueByPeriod = Object.keys(revenueByPeriod).map(period => ({
        name: period,
        value: revenueByPeriod[period]
      }));
  
      console.log('Receita por Período:', this.revenueByPeriod);
    }
  }

  submeterUsuario() {
    const id = this.formUsuario.get('id')?.value;
  
    if (this.formUsuario.valid) {
      const user: Usuario = {
        id: id,
        nome: this.formUsuario.get('nome')?.value || '',
        email: this.formUsuario.get('email')?.value || ''
      };
  
      if (id) {
        // Atualiza usuário existente
        this.apiService.updateClient(id, user).subscribe(
          resp => {
            console.log("Usuário atualizado com sucesso:", resp);
            this.lerUsuarios(); // Atualiza a lista de usuários após atualizar
            this.formUsuario.reset(); // Reseta o formulário após o envio
          },
          err => console.log("Erro ao atualizar usuário:", err)
        );
      } else {
        // Cria novo usuário
        this.apiService.saveClients(user).subscribe(
          resp => {
            console.log("Usuário salvo com sucesso:", resp);
            this.lerUsuarios(); // Atualiza a lista de usuários após salvar
            this.formUsuario.reset(); // Reseta o formulário após o envio
          },
          err => console.log("Erro ao salvar usuário:", err)
        );
      }
    } else {
      console.log("Formulário inválido!");
    }
  }
  
  
  lerUsuarios() {
    this.apiService.getClients().subscribe(
      (usuarios: Usuario[]) => {
        console.log("Usuários recebidos:", this.clients);
        // Aqui você pode armazenar os usuários em uma variável e exibi-los em uma tabela, por exemplo
        this.listaUsuarios = this.clients; // listaUsuarios seria uma variável que mantém os usuários
      },
      err => console.log("Erro ao buscar usuários:", err)
    );
  }
  
    // atualizar o usuário
    atualizarUsuario(id: number): void {
      if (id !== undefined) {
        const usuario = this.listaUsuarios.find(u => u.id === id);
        if (usuario) {
          this.formUsuario.patchValue({
            nome: usuario.nome,
            email: usuario.email
          });
          
          this.formUsuario.patchValue({ id: usuario.id });
        }
      } else {
        console.error("ID de usuário indefinido");
      }
    }
    

  // Método para excluir o usuário
  excluirUsuario(id: number): void {
    if (id !== undefined) {
      this.apiService.deleteClient(id).subscribe(() => {
        console.log(`Usuário com ID ${id} excluído com sucesso`);
        this.listaUsuarios = this.listaUsuarios.filter(u => u.id !== id);
      },
      err => console.log("Erro ao excluir usuário:", err));
    } else {
      console.error("ID de usuário indefinido");
    }
  }
  

  

}
