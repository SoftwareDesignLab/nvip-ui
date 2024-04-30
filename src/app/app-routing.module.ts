import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VulnerabilitiesComponent } from './cve/vulnerabilities/vulnerabilities.component';
import { CveDetailsComponent } from './cve/cve-details/cve-details.component';
import { AboutComponent } from './layout/about/about.component';
import { FaqComponent } from './layout/faq/faq.component';

const routes: Routes = [
    { path: "", redirectTo: "/vulnerabilities", pathMatch: "full" },
    {
        path: 'vulnerabilities',
        component: VulnerabilitiesComponent,
    },
    {
        path: 'cve/:cveId',
        component: CveDetailsComponent,
    },
    {
        path:'about',
        component:AboutComponent
    },
    {
        path:'faq',
        component:FaqComponent
    },
    {
        path:'exploits',
        component:FaqComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
