import { Component, OnInit, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/AuthService';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatListModule, RouterLink, RouterLinkActive, NgIf],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  private auth = inject(AuthService);


  permitted = new Set<string>();

  ngOnInit(): void {
    const sections = this.auth.getPermittedSections(true); 
    this.permitted = new Set(sections);

  }

  can(section: string): boolean {
    return this.permitted.has(section);
  }

}