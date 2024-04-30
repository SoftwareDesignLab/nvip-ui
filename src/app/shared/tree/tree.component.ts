import { Component, ElementRef, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';
import { TreeNode } from '../../cve/models/models';

@Component({
    selector: 'app-tree',
    templateUrl: './tree.component.html',
    styleUrl: './tree.component.scss',
})
export class TreeComponent implements OnInit {
    @Input() treeData: TreeNode = null;
    margin = { top: 20, bottom: 0 };
    width = 600;
    height = 600 - this.margin.top - this.margin.bottom;
    svg: any;
    i = 0;
    duration = 750;
    root: any;
    treemap: any;
    rectW: number = 150;
    rectH: number = 35;
    ngOnInit(): void {
        this.svg = d3
            .select('#tree2')
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%') //height + margin.top + margin.bottom)
            .attr('viewBox', '0 0 600 420')
            .append('g')
            .attr('transform', 'translate(0,' + this.margin.top + ')');

        this.treemap = d3.tree().size([this.width, this.height]);
        this.root = d3.hierarchy(this.treeData, (d) => {
            return d.children;
        });

        this.root.x0 = this.width / 2;
        this.root.y0 = 0;

        this.update(this.root);
    }

    update(source: any) {
        var treeData = this.treemap(this.root);

        // Compute the new tree layout.
        var nodes = treeData.descendants(),
            links = treeData.descendants().slice(1);
        nodes.forEach((d: any) => {
            d.y = d.depth * 90;
        });

        var node = this.svg.selectAll('g.node').data(nodes, (d) => {
            return d.id || (d.id = ++this.i);
        });

        var nodeEnter = node
            .enter()
            .append('g')
            .attr('class', 'node')
            .attr('transform', (d) => {
                return 'translate(' + source.y0 + ',' + source.x0 + ')';
            })
            .on('click', (_, d) => this.click(d));

        nodeEnter
            .append('circle')
            .attr('class', 'node')
            .attr('r', 6)
            .attr('cy', -1 * (this.rectH / 2))
            .attr('cx', 0)
            .attr('stroke', (d) => {
                return d.data.isRoot == false ? d.data.valueColor : 'black';
            })
            .attr('stroke-width', 2)

        nodeEnter
            .append('rect')
            .attr('width', (d) => {
                return d.data.width;
            })
            .attr('height', this.rectH)
            .attr('y', -1 * (this.rectH / 2))
            .attr('x', (d) => {
                return -1 * (d.data.width / 2);
            })
            .attr('rx', 18) // Apply the x-axis corner radius
            .attr('ry', 18)
            .attr('fill', '#111111')
            .attr('stroke', (d) => {
                return d.data.valueColor;
            })
            .attr('stroke-width', 1.2)

        var rectNode = { width: this.rectW, height: this.rectH, textMargin: 1 };

        nodeEnter
            .append('foreignObject')
            .attr('y', -1 * (this.rectH / 2) + rectNode.textMargin)
            .attr('x', (d: any) => {
                return -1 * (d.data.width / 2);
            })
            .attr('width', (d: any) => {
                return d.data.width;
            })
            .attr('height', this.rectH)
            .attr('cursor', (d: any) =>
                d.data.children ? 'pointer' : 'default'
            )
            .append('xhtml')
            .html((d: any) => {
                var str = `
                    <div style="width:${d.data.width}px;
                                height:${
                                    rectNode.height - rectNode.textMargin * 2
                                }px;"> 
                                <p class="text-center mt-1" style="font-size:15px;">
                                    <span style="color:${d.data.titleColor};">${
                    d.data.title
                }</span>
                                    <span class="text-capitalize" style="color:${
                                        d.data.valueColor
                                    };">${d.data.value}</span>
                                </p>
                    </div>
                `;
                return str;
            });

        var nodeUpdate = nodeEnter.merge(node);

        // Transition to the proper position for the nodes
        nodeUpdate
            .transition()
            .duration(this.duration)
            .attr('transform', (d) => {
                return 'translate(' + d.x + ',' + d.y + ')';
            });

        var nodeExit = node
            .exit()
            .transition()
            .duration(this.duration)
            .attr('transform', (d: any) => {
                return 'translate(' + source.x + ',' + source.y + ')';
            })
            .remove();

        // On exit reduce the node circles size to 0
        nodeExit.select('circle').attr('r', 1e-6);

        // On exit reduce the opacity of text lables
        nodeExit.select('text').style('fill-opacity', 1e-6);

        // **************** Links Section ****************

        // Update the links...
        var link = this.svg.selectAll('path.link').data(links, (d: any) => {
            return d.id;
        });

        var linkEnter = link
            .enter()
            .insert('path', 'g')
            .attr('class', 'link')
            .attr('d', (d: any) => {
                var o = { x: source.x0, y: source.y0 };
                return this.diagonal(o, o);
            });

        var linkUpdate = linkEnter.merge(link);

        linkUpdate
            .transition()
            .duration(this.duration)
            .attr('d', (d) => {
                return this.diagonal(d.parent, d);
            });

        // Remove any existing links
        var linkExit = link
            .exit()
            .transition()
            .duration(this.duration)
            .attr('d', function (d) {
                var o = { x: source.x, y: source.y };
            })
            .remove();

        nodes.forEach((d) => {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    diagonal(s: any, d: any) {
        // This
        const startX = s.x;
        const startY = s.y;

        // Ending point at the top center of the destination node
        const endX = d.x;
        const endY = d.y - 20;

        // Control points directly above the starting point and directly below the ending point
        const ctrlX1 = startX;
        const ctrlY1 = startY + (endY - startY) / 2; // Halfway point for the control
        const ctrlX2 = endX;
        const ctrlY2 = startY + (endY - startY) / 2;

        const path = `M ${startX} ${startY}
                  C ${ctrlX1} ${ctrlY1},
                    ${ctrlX2} ${ctrlY2},
                    ${endX} ${endY}`;
        return path;
    }

    click(d: any) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        this.update(d);
    }
}
/*export class TreeComponent implements OnInit {


    i = 0;
    treemap: any;

    constructor(private el: ElementRef) {}
    ngOnInit(): void {
        this.treeData = treeData;
        this.svg = d3.select('#tree2').append('svg');

        this.svg.attr('preserveAspectRatio', 'xMidYMid meet').append('g');
        // declares a tree layout and assigns the size
        this.treemap = d3.tree().size([this.height, 50]);

        // Assigns parent, children, height, depth
        this.root = d3.hierarchy(this.treeData, (d: any) => {
            return d.children;
        });

        setTimeout(() => {
            this.updateSize();
            this.update(this.root);
        });
    }
    updateSize() {
        this.margin.left = 0;

        this.margin.right = 0;

        this.svg
            .attr('width', this.width + 'px')
            .attr('height', this.height + 'px');
    }
    update(source: any) {
        // Assigns the x and y position for the nodes
        const treeData = this.treemap(this.root);
    
        // Compute the new tree layout.
        const nodes = treeData.descendants();
        const links = treeData.descendants().slice(1);
    
        // Normalize for fixed-depth.
        nodes.forEach((d: any) => {
            d.y = d.depth * 180; // You can change 180 to the desired separation between nodes
        });
    
        // ****************** Nodes section ***************************
    
        // Update the nodes...
        const node = this.svg.selectAll('g.node')
            .data(nodes, (d: any) => d.id || (d.id = ++this.i));
    
        // Enter any new modes at the parent's previous position.
        const nodeEnter = node.enter().append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${source.y0},${source.x0})`)
            .on('click', d => this.click(d));
    
        // Add rectangles for the nodes
        nodeEnter.append('rect')
            .attr('class', 'node')
            .attr('width', this.rectW)
            .attr('height', this.rectH)
            .attr('y', -this.rectH / 2)
            .attr('x', -this.rectW / 2);
    
        // Add labels for the nodes
        nodeEnter.append('text')
            .attr('dy', '.35em')
            .attr('x', d => d.children || d._children ? -this.rectW / 2 + 10 : this.rectW / 2 - 10)
            .attr('text-anchor', d => d.children || d._children ? 'start' : 'end')
            .text(d => d.data.name);
    
        // UPDATE
        const nodeUpdate = nodeEnter.merge(node);
    
        // Transition to the proper position for the node
        nodeUpdate.transition()
            .duration(this.duration)
            .attr('transform', d => `translate(${d.y},${d.x})`);
    
        // Remove any exiting nodes
        const nodeExit = node.exit().transition()
            .duration(this.duration)
            .attr('transform', d => `translate(${source.y},${source.x})`)
            .remove();
    
        // ****************** Links section ***************************
    
        // Update the links...
        const link = this.svg.selectAll('path.link')
            .data(links, d => d.id);
    
        // Enter any new links at the parent's previous position.
        const linkEnter = link.enter().insert('path', 'g')
            .attr('class', 'link')
            .attr('d', d => {
                const o = { x: source.x0, y: source.y0 };
                return this.diagonal(o, o);
            });
    
        // UPDATE
        const linkUpdate = linkEnter.merge(link);
    
        // Transition back to the parent element position
        linkUpdate.transition()
            .duration(this.duration)
            .attr('d', d => this.diagonal(d, d.parent));
    
        // Remove any exiting links
        link.exit().transition()
            .duration(this.duration)
            .attr('d', d => {
                const o = { x: source.x, y: source.y };
                return this.diagonal(o, o);
            })
            .remove();
    
        // Store the old positions for transition.
        nodes.forEach(d => {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    collapse(d: any) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach((d: any) => this.collapse(d));
            d.children = null;
        }
    }

    click(d: any) {
        if (d.parent != null) {
            d.parent.children.forEach((s) => {
                if (s != d) this.collapseSlibing(s);
            });
        }

        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        setTimeout(() => {
            this.update(d);
        });
    }
    collapseSlibing(d: any) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach((d: any) => this.collapse(d));
            d.children = null;
        }
    }

    diagonal(s, d) {
        const path = `M ${s.y} ${s.x}
                C ${(s.y + d.y) / 2} ${s.x},
                  ${(s.y + d.y) / 2} ${d.x},
                  ${d.y} ${d.x}`;
    
        return path;
    }

}*/
