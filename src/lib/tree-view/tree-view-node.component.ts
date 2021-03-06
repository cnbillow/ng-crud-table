import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {TreeNode, Tree, FilterState} from '../tree';

@Component({
  selector: 'app-tree-view-node',
  template: `
    <li *ngIf="node" [ngClass]="nodeClass()">
      <i [ngClass]="getExpanderIcon(node)"
         (click)="onExpand(node)">
      </i>
      <span [ngClass]="nodeContentClass()"
            (click)="onSelectNode(node)"
            (dblclick)="onExpand(node)"
            (contextmenu)="onNodeRightClick($event)">
        <i *ngIf="node.icon || getIconFunc" [ngClass]="getIcon(node)"></i>
        {{node.name}}
      </span>
      <ul class="tree-container" *ngIf="node.children && node.expanded">
        <app-tree-view-node
          *ngFor="let childNode of node.children"
          [node]="childNode"
          [getIconFunc]="getIconFunc"
          (selectedChanged)="selectedChanged.emit($event)"
          (nodeRightClick)="nodeRightClick.emit($event)">
        </app-tree-view-node>
      </ul>
    </li>
  `
})
export class TreeViewNodeComponent implements OnInit {

  @Input() node: TreeNode;
  @Input() getIconFunc: (node?: TreeNode) => string;

  @Output() selectedChanged: EventEmitter<TreeNode> = new EventEmitter<TreeNode>();
  @Output() nodeRightClick: EventEmitter<any> = new EventEmitter();

  loading: boolean;

  constructor(private tree: Tree) {
  }

  ngOnInit() {
  }

  isSelected(node: TreeNode) {
    return node === this.tree.selectedNode;
  }

  onSelectNode(node: TreeNode) {
    if (this.tree.selectedNode !== node) {
      this.tree.selectedNode = node;
      this.selectedChanged.emit(node);
    }
  }

  onExpand(node: TreeNode) {
    node.expanded = !node.expanded;
    if (node.expanded) {
      this.loading = true;
      this.tree.loadNode(node).then(() => {
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    }
  }

  getExpanderIcon(node: TreeNode): string {
    let icon: string;
    if (this.loading) {
      return 'icon-collapsing';
    }
    if (!node.isLeaf() && node.expanded) {
      icon = 'icon-node icon-collapsed';
    } else if (!node.isLeaf()) {
      icon = 'icon-node';
    }
    return icon;
  }

  getIcon(node: TreeNode) {
    if (this.getIconFunc) {
      return this.getIconFunc(node);
    } else {
      return node.icon;
    }
  }

  nodeClass(): string {
    let cls = 'treenode';
    if (this.node.$$filterState === FilterState.NOT_FOUND) {
      cls += ' filter-not-found';
    }
    return cls;
  }

  nodeContentClass(): string {
    let cls = 'treenode-content';
    if (this.node.$$filterState === FilterState.FOUND) {
      cls += ' filter-found';
    } else if (this.node.$$filterState === FilterState.ON_FOUND_PATH) {
      cls += ' filter-on-path';
    }
    if (this.isSelected(this.node)) {
      cls += ' highlight';
    }
    return cls;
  }

  onNodeRightClick(event: MouseEvent) {
    this.onSelectNode(this.node);
    this.nodeRightClick.emit({'event': event, 'node': this.node});
  }

}
