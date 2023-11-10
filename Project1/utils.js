function multiplyMatrices(matrixA, matrixB) {
    var result = [];

    for (var i = 0; i < 4; i++) {
        result[i] = [];
        for (var j = 0; j < 4; j++) {
            var sum = 0;
            for (var k = 0; k < 4; k++) {
                sum += matrixA[i * 4 + k] * matrixB[k * 4 + j];
            }
            result[i][j] = sum;
        }
    }

    // Flatten the result array
    return result.reduce((a, b) => a.concat(b), []);
}
function createIdentityMatrix() {
    return new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
}

function createScaleMatrix(scale_x, scale_y, scale_z) {
    return new Float32Array([
        scale_x, 0, 0, 0,
        0, scale_y, 0, 0,
        0, 0, scale_z, 0,
        0, 0, 0, 1
    ]);
}

function createTranslationMatrix(x_amount, y_amount, z_amount) {
    return new Float32Array([
        1, 0, 0, x_amount,
        0, 1, 0, y_amount,
        0, 0, 1, z_amount,
        0, 0, 0, 1
    ]);
}

function createRotationMatrix_Z(radian) {
    return new Float32Array([
        Math.cos(radian), -Math.sin(radian), 0, 0,
        Math.sin(radian), Math.cos(radian), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ])
}

function createRotationMatrix_X(radian) {
    return new Float32Array([
        1, 0, 0, 0,
        0, Math.cos(radian), -Math.sin(radian), 0,
        0, Math.sin(radian), Math.cos(radian), 0,
        0, 0, 0, 1
    ])
}

function createRotationMatrix_Y(radian) {
    return new Float32Array([
        Math.cos(radian), 0, Math.sin(radian), 0,
        0, 1, 0, 0,
        -Math.sin(radian), 0, Math.cos(radian), 0,
        0, 0, 0, 1
    ])
}

function getTransposeMatrix(matrix) {
    return new Float32Array([
        matrix[0], matrix[4], matrix[8], matrix[12],
        matrix[1], matrix[5], matrix[9], matrix[13],
        matrix[2], matrix[6], matrix[10], matrix[14],
        matrix[3], matrix[7], matrix[11], matrix[15]
    ]);
}

const vertexShaderSource = `
attribute vec3 position;
attribute vec3 normal; // Normal vector for lighting

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 normalMatrix;

uniform vec3 lightDirection;

varying vec3 vNormal;
varying vec3 vLightDirection;

void main() {
    vNormal = vec3(normalMatrix * vec4(normal, 0.0));
    vLightDirection = lightDirection;

    gl_Position = vec4(position, 1.0) * projectionMatrix * modelViewMatrix; 
}

`

const fragmentShaderSource = `
precision mediump float;

uniform vec3 ambientColor;
uniform vec3 diffuseColor;
uniform vec3 specularColor;
uniform float shininess;

varying vec3 vNormal;
varying vec3 vLightDirection;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(vLightDirection);
    
    // Ambient component
    vec3 ambient = ambientColor;

    // Diffuse component
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = diff * diffuseColor;

    // Specular component (view-dependent)
    vec3 viewDir = vec3(0.0, 0.0, 1.0); // Assuming the view direction is along the z-axis
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
    vec3 specular = spec * specularColor;

    gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
}

`

/**
 * @WARNING DO NOT CHANGE ANYTHING ABOVE THIS LINE
 */



/**
 * 
 * @TASK1 Calculate the model view matrix by using the chatGPT
 */

function getChatGPTModelViewMatrix() {
    const transformationMatrix = new Float32Array([
        0.4330126941204071, -0.25, 0.8660253882408142, 0.3,
        0.4330126941204071, 0.25, -0.8660253882408142, -0.25,
        -0.7911540861129761, 0.8660253882408142, 0.25, 0,
        0, 0, 0, 1
    ]);
    return getTransposeMatrix(transformationMatrix);
}


/**
 * 
 * @TASK2 Calculate the model view matrix by using the given 
 * transformation methods and required transformation parameters
 * stated in transformation-prompt.txt
 */
function getModelViewMatrix() {

    const translationX = 0.3;
    const translationY = -0.25;
    const scaleX = 0.5;
    const scaleY = 0.5;
    const rotationX = 30 * (Math.PI / 180); // Convert degrees to radians
    const rotationY = 45 * (Math.PI / 180); // Convert degrees to radians
    const rotationZ = 60 * (Math.PI / 180); // Convert degrees to radians

    const transformationMatrix = createIdentityMatrix();
    console.log("Initial");
    console.log(transformationMatrix);
    const translastionMatrix = createTranslationMatrix(translationX, translationY, 0);
    const scalingMatrix = createScaleMatrix(scaleX, scaleY, 1);
    const rotationMatrixX = createRotationMatrix_X(rotationX);
    const rotationMatrixY = createRotationMatrix_Y(rotationY);
    const rotationMatrixZ = createRotationMatrix_Z(rotationZ);

    transformationMatrix.set(multiplyMatrices(transformationMatrix, translastionMatrix), 0);
    console.log("Translated");
    console.log(transformationMatrix);
    transformationMatrix.set(multiplyMatrices(transformationMatrix, scalingMatrix), 0);
    console.log("Scaled");
    console.log(transformationMatrix);
    transformationMatrix.set(multiplyMatrices(transformationMatrix, rotationMatrixX), 0);
    console.log("Rotation-X");
    console.log(transformationMatrix);
    transformationMatrix.set(multiplyMatrices(transformationMatrix, rotationMatrixY), 0);
    console.log("Rotation-Y");
    console.log(transformationMatrix);
    transformationMatrix.set(multiplyMatrices(transformationMatrix, rotationMatrixZ), 0);
    console.log("Rotation-Z");
    console.log(transformationMatrix);

    return transformationMatrix;

}

/**
 * 
 * @TASK3 Ask CHAT-GPT to animate the transformation calculated in 
 * task2 infinitely with a period of 10 seconds. 
 * First 5 seconds, the cube should transform from its initial 
 * position to the target position.
 * The next 5 seconds, the cube should return to its initial position.
 */
function getPeriodicMovement(startTime) {
    const animationDuration = 0.001 * 1000; // 10 seconds in milliseconds
    identityMatrix = createIdentityMatrix();
    providedMatrix = new Float32Array([
        0.1767766922712326,
        -0.3061861991882324,
        0.3535533845424652,
        0.30000001192092896,
        0.4633883237838745,
        0.06341324001550674,
        -0.1767766922712326,
        -0.25,
        0.12682649493217468,
        0.7803300619125366,
        0.6123723983764648,
        0,
        0,
        0,
        0,
        1
    ]);
    currentTime = Date.now();
    const elapsed = (currentTime - startTime) % animationDuration;
    const halfDuration = animationDuration / 2;

    if (elapsed <= halfDuration) {
        // Transition to the provided transformation matrix in the first 5 seconds
        const progress = elapsed / halfDuration;

        // Interpolate between the identity matrix and the provided matrix
        const interpolatedMatrix = new Float32Array(16);
        for (let i = 0; i < 16; i++) {
            interpolatedMatrix[i] =
                (1 - progress) * identityMatrix[i] + progress * providedMatrix[i];
        }

        return interpolatedMatrix;
    } else {
        // Return to the identity matrix in the last 5 seconds
        const progress = (elapsed - halfDuration) / halfDuration;

        // Interpolate between the provided matrix and the identity matrix
        const interpolatedMatrix = new Float32Array(16);
        for (let i = 0; i < 16; i++) {
            interpolatedMatrix[i] =
                (1 - progress) * providedMatrix[i] + progress * identityMatrix[i];
        }

        return interpolatedMatrix;
    }
}



