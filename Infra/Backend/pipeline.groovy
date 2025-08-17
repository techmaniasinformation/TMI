pipeline {
    agent any

    environment {
        GIT_CLONE_DIR = '/tmp/be'
        REPO_URL = 'https://lab.ssafy.com/s13-webmobile2-sub1/S13P11A509.git'
        BRANCH = 'be'
        IMAGE_NAME = 'tmi-app-image'
        CONTAINER_NAME = 'spring-app'
        PORT = '8080'
    }

    stages {

        stage('Clone Repository') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'gitlab-user-with-password', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                    sh '''
            rm -rf $GIT_CLONE_DIR
            git clone -b $BRANCH https://$GIT_USER:$GIT_PASS@lab.ssafy.com/s13-webmobile2-sub1/S13P11A509.git $GIT_CLONE_DIR
          '''
                }
            }
        }

        stage('Gradle Build') {
            steps {
                sh '''
          export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64 
          export PATH=$JAVA_HOME/bin:$PATH
          cd $GIT_CLONE_DIR/backend
          chmod +x ./gradlew
          ./gradlew clean build -x test
        '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
          docker build -t $IMAGE_NAME:latest $GIT_CLONE_DIR/backend
        '''
            }
        }

        stage('Stop Old Container') {
            steps {
                sh '''
          docker stop $CONTAINER_NAME || true
          docker rm -f $CONTAINER_NAME || true
        '''
            }
        }

        stage('Run New Container') {
            steps {
                withCredentials([file(credentialsId: 'ENV_FILE', variable: 'ENV_FILE')]) {
                    sh '''
            docker run -d --name $CONTAINER_NAME \
              --network tmi_default \
              -p $PORT:$PORT \
              -e SPRING_REDIS_HOST=redis \
              -e SPRING_PROFILES_ACTIVE=dev \
              --env-file $ENV_FILE \
              -v /home/ubuntu/tmi/images:/app/images \
              $IMAGE_NAME:latest
          '''
                }
            }
        }

        stage('restart nginx') {
            steps {
                sh '''
          docker restart nginx
          '''
            }
        }

    } // end of stages

    post {
        success {
            echo '✅ 배포 성공'
            sh 'docker image prune -f'
        }
        failure {
            echo '❌ 배포 실패'
        }
    }
}