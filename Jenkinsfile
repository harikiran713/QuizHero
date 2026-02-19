pipeline {
    agent any

    environment {
        DOCKERHUB_USER = "harikiran50612"
        IMAGE_NAME = "quizhero"
    }

    stages {

        stage('Clone Repo') {
            steps {
                git branch: 'main', url: 'https://github.com/harikiran713/QuizHero.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                docker build -t $DOCKERHUB_USER/$IMAGE_NAME:latest .
                """
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh """
                    echo "$PASS" | docker login -u "$USER" --password-stdin
                    """
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                sh """
                docker push $DOCKERHUB_USER/$IMAGE_NAME:latest
                """
            }
        }
    }
}
