/**
 * @class SceneNode
 * @desc A SceneNode is a node in the scene graph.
 * @property {MeshDrawer} meshDrawer - The MeshDrawer object to draw
 * @property {TRS} trs - The TRS object to transform the MeshDrawer
 * @property {SceneNode} parent - The parent node
 * @property {Array} children - The children nodes
 */

class SceneNode {
    constructor(meshDrawer, trs, parent = null) {
        this.meshDrawer = meshDrawer;
        this.trs = trs;
        this.parent = parent;
        this.children = [];

        if (parent) {
            this.parent.__addChild(this);
        }
    }

    __addChild(node) {
        this.children.push(node);
    }

    draw(mvp, modelView, normalMatrix, modelMatrix) {
        
        var transMatrix = this.trs.getTransformationMatrix();
        var newNormal = MatrixMult(normalMatrix, transMatrix);
        var newMvp = MatrixMult(mvp, transMatrix);
        var newModelView = MatrixMult(modelView, transMatrix);
        var newModel = MatrixMult(modelMatrix, transMatrix);

        for(var child of this.children){
            child.draw(newMvp, newModelView, newNormal, newModel);
        }

        // Draw the MeshDrawer
        if (this.meshDrawer) {
            this.meshDrawer.draw(newMvp, newModelView, newNormal, newModel);
        }
    }

    

}